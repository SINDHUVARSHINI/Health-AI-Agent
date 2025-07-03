exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('email').unique().notNullable();
      table.string('password_hash').notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.enum('role', ['patient', 'caregiver', 'healthcare_provider', 'admin']).notNullable();
      table.date('date_of_birth');
      table.string('phone');
      table.boolean('is_active').defaultTo(true);
      table.boolean('email_verified').defaultTo(false);
      table.timestamp('email_verified_at');
      table.timestamp('last_login_at');
      table.timestamps(true, true);
      
      table.index(['email']);
      table.index(['role']);
    })
    .createTable('patients', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('cancer_type').notNullable();
      table.date('diagnosis_date').notNullable();
      table.enum('treatment_stage', ['diagnosis', 'treatment', 'recovery', 'surveillance', 'palliative']).notNullable();
      table.jsonb('current_treatments').defaultTo('[]');
      table.jsonb('emergency_contact');
      table.text('medical_history');
      table.jsonb('allergies').defaultTo('[]');
      table.jsonb('medications').defaultTo('[]');
      table.timestamps(true, true);
      
      table.index(['user_id']);
      table.index(['cancer_type']);
      table.index(['treatment_stage']);
    })
    .createTable('symptoms', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE');
      table.jsonb('symptoms').notNullable();
      table.integer('severity').checkBetween([1, 10]);
      table.string('duration');
      table.text('notes');
      table.timestamp('recorded_at').defaultTo(knex.fn.now());
      table.timestamps(true, true);
      
      table.index(['patient_id']);
      table.index(['recorded_at']);
    })
    .createTable('medications', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('dosage').notNullable();
      table.string('frequency').notNullable();
      table.date('start_date').notNullable();
      table.date('end_date');
      table.string('prescribed_by');
      table.text('notes');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
      
      table.index(['patient_id']);
      table.index(['name']);
      table.index(['is_active']);
    })
    .createTable('appointments', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE');
      table.string('type').notNullable();
      table.date('date').notNullable();
      table.time('time').notNullable();
      table.string('provider').notNullable();
      table.string('location').notNullable();
      table.text('notes');
      table.integer('reminder_time'); // minutes before appointment
      table.boolean('reminder_sent').defaultTo(false);
      table.enum('status', ['scheduled', 'confirmed', 'completed', 'cancelled']).defaultTo('scheduled');
      table.timestamps(true, true);
      
      table.index(['patient_id']);
      table.index(['date', 'time']);
      table.index(['status']);
    })
    .createTable('health_metrics', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE');
      table.decimal('weight', 5, 2);
      table.integer('blood_pressure_systolic');
      table.integer('blood_pressure_diastolic');
      table.decimal('temperature', 4, 1);
      table.integer('heart_rate');
      table.integer('oxygen_saturation');
      table.integer('pain_level').checkBetween([0, 10]);
      table.integer('fatigue_level').checkBetween([0, 10]);
      table.enum('mood', ['excellent', 'good', 'fair', 'poor', 'terrible']);
      table.timestamp('recorded_at').defaultTo(knex.fn.now());
      table.timestamps(true, true);
      
      table.index(['patient_id']);
      table.index(['recorded_at']);
    })
    .createTable('ai_conversations', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE');
      table.text('user_message').notNullable();
      table.text('ai_response').notNullable();
      table.jsonb('patient_context');
      table.string('conversation_type'); // chat, symptom_analysis, education, etc.
      table.timestamp('conversation_at').defaultTo(knex.fn.now());
      table.timestamps(true, true);
      
      table.index(['patient_id']);
      table.index(['conversation_at']);
      table.index(['conversation_type']);
    })
    .createTable('notifications', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('type').notNullable(); // appointment, medication, symptom, emergency
      table.string('title').notNullable();
      table.text('message').notNullable();
      table.jsonb('data');
      table.boolean('is_read').defaultTo(false);
      table.timestamp('read_at');
      table.timestamp('scheduled_for');
      table.timestamp('sent_at');
      table.timestamps(true, true);
      
      table.index(['user_id']);
      table.index(['is_read']);
      table.index(['scheduled_for']);
      table.index(['type']);
    })
    .createTable('notification_preferences', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.boolean('email').defaultTo(true);
      table.boolean('sms').defaultTo(false);
      table.boolean('push').defaultTo(true);
      table.boolean('appointment_reminders').defaultTo(true);
      table.boolean('medication_reminders').defaultTo(true);
      table.boolean('symptom_check_ins').defaultTo(true);
      table.boolean('emergency_alerts').defaultTo(true);
      table.timestamps(true, true);
      
      table.index(['user_id']);
    })
    .createTable('care_teams', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE');
      table.uuid('provider_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('role').notNullable(); // oncologist, nurse, social_worker, etc.
      table.boolean('is_primary').defaultTo(false);
      table.timestamps(true, true);
      
      table.index(['patient_id']);
      table.index(['provider_id']);
      table.unique(['patient_id', 'provider_id']);
    })
    .createTable('treatment_plans', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE');
      table.string('treatment_type').notNullable();
      table.date('start_date').notNullable();
      table.date('end_date');
      table.text('description');
      table.jsonb('protocol');
      table.enum('status', ['planned', 'active', 'completed', 'cancelled']).defaultTo('planned');
      table.timestamps(true, true);
      
      table.index(['patient_id']);
      table.index(['treatment_type']);
      table.index(['status']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('treatment_plans')
    .dropTableIfExists('care_teams')
    .dropTableIfExists('notification_preferences')
    .dropTableIfExists('notifications')
    .dropTableIfExists('ai_conversations')
    .dropTableIfExists('health_metrics')
    .dropTableIfExists('appointments')
    .dropTableIfExists('medications')
    .dropTableIfExists('symptoms')
    .dropTableIfExists('patients')
    .dropTableIfExists('users');
}; 