const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    // Initialize Gemini if API key is available
    if (process.env.GOOGLE_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });
      this.isAvailable = true;
    } else {
      this.isAvailable = false;
      console.log('Google API key not configured. AI features will be limited.');
    }
    
    // Health assistant system prompts
    this.healthContext = `
      You are a compassionate AI health assistant specifically designed to support patients. 
      Your role is to provide helpful, accurate, and supportive information while always encouraging 
      patients to consult with their healthcare providers for medical decisions.
      
      Key principles:
      - Always prioritize patient safety and well-being
      - Provide evidence-based information about treatments and symptoms
      - Offer emotional support and coping strategies
      - Encourage regular communication with healthcare providers
      - Never make definitive medical diagnoses
      - Always recommend consulting healthcare professionals for medical decisions
      - Be empathetic and understanding of the patient's journey

      Format your responses using this HTML structure:
      
      <div class="response-container">
        <h3>[Main Topic]</h3>
        <p>[Opening paragraph with empathetic acknowledgment]</p>
        
        <div class="key-points">
          <h4>Key Points to Consider:</h4>
          <ul>
            <li>[Point 1]</li>
            <li>[Point 2]</li>
          </ul>
        </div>
        
        <div class="explanation">
          <p>[Detailed explanation paragraph]</p>
        </div>
        
        <div class="alert">
          [Important warning or medical disclaimer]
        </div>
        
        <div class="tips">
          <h4>Helpful Tips:</h4>
          <ul>
            <li>[Tip 1]</li>
            <li>[Tip 2]</li>
          </ul>
        </div>
        
        <p class="conclusion">[Supportive closing statement]</p>
      </div>

      Example:
      <div class="response-container">
        <h3>Understanding Calories in Ice Cream</h3>
        <p>I understand you're curious about the calorie content of ice cream. That's a great question! It's important to be mindful of what we're eating, especially if we're trying to manage our weight or overall health.</p>
        
        <div class="key-points">
          <h4>Factors Affecting Calorie Content:</h4>
          <ul>
            <li>Flavor: Richer flavors like chocolate fudge have more calories than simpler ones</li>
            <li>Ingredients: Whole milk vs. skim milk options</li>
            <li>Serving Size: Often smaller than what people typically eat</li>
            <li>Brand: Different recipes lead to varying calorie counts</li>
          </ul>
        </div>
        
        <div class="explanation">
          <p>Generally speaking, a 1/2 cup (about 64 grams) serving of regular ice cream can range from approximately 130 to over 300 calories. Lower-fat or "light" ice creams will have fewer calories, while premium or super-premium ice creams will have more.</p>
        </div>
        
        <div class="alert">
          Always consult with your healthcare provider or a registered dietitian for personalized dietary advice.
        </div>
        
        <div class="tips">
          <h4>Helpful Tips:</h4>
          <ul>
            <li>Read the Label: Check nutrition facts for accurate information</li>
            <li>Portion Control: Measure servings instead of eating from the container</li>
            <li>Consider Alternatives: Try lower-fat options or frozen yogurt</li>
            <li>Enjoy in Moderation: Part of a balanced diet</li>
          </ul>
        </div>
        
        <p class="conclusion">I hope this information helps! Remember, I'm here to support you with information, but always discuss specific dietary needs with your healthcare provider.</p>
      </div>
    `;
  }

  async generateResponse(userMessage, patientContext = {}) {
    try {
      // If AI is not available, return a fallback response
      if (!this.isAvailable) {
        return this.getFallbackResponse(userMessage, patientContext);
      }

      const prompt = {
        contents: [{
          parts: [{
            text: `${this.healthContext}

User context:
${this.buildContextualMessage(userMessage, patientContext)}

User message: ${userMessage}

Please provide a helpful and empathetic response using the HTML formatting specified above for better readability:`
          }]
        }]
      };

      const result = await this.model.generateContent(prompt);
      let text = result.response.text();
      
      // Remove any markdown formatting that might have slipped through
      text = text.replace(/\*\*/g, '')
                 .replace(/__/g, '')
                 .replace(/##/g, '')
                 .replace(/\*(?!\*)/g, '')
                 .replace(/_(?!_)/g, '');
      
      console.log('AI response generated successfully');
      return text;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getFallbackResponse(userMessage, patientContext);
    }
  }

  getFallbackResponse(userMessage, patientContext = {}) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword-based responses when AI is not available
    if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('feel')) {
      return `
<h3>Symptom Management Guidance</h3>
<p>I understand you're experiencing symptoms. While I can't provide specific medical advice, here are some general recommendations:</p>

<ul>
  <li>Monitor your symptoms closely</li>
  <li>Contact your healthcare provider if symptoms worsen</li>
  <li>Keep a symptom diary to share with your medical team</li>
  <li>Don't hesitate to seek emergency care for severe symptoms</li>
</ul>

<div class="alert">
Remember: I'm here to support you, but always consult with your healthcare providers for medical decisions.
</div>`;
    }
    
    if (lowerMessage.includes('treatment') || lowerMessage.includes('therapy') || lowerMessage.includes('medication')) {
      return `
<h3>Treatment Discussion Guidelines</h3>
<p>Regarding your treatment questions, here are some important recommendations:</p>

<ul>
  <li>Discuss all treatment options with your healthcare provider</li>
  <li>Ask about potential side effects and how to manage them</li>
  <li>Follow your treatment plan as prescribed</li>
  <li>Keep track of any side effects you experience</li>
  <li>Don't hesitate to ask questions during appointments</li>
</ul>

<div class="tip">
Your healthcare team is the best source for treatment-specific guidance.
</div>`;
    }
    
    if (lowerMessage.includes('appointment') || lowerMessage.includes('doctor') || lowerMessage.includes('visit')) {
      return `
<h3>Preparing for Your Appointment</h3>
<p>To make the most of your upcoming appointment, here are some helpful suggestions:</p>

<ul>
  <li>Write down your questions beforehand</li>
  <li>Bring a list of current symptoms</li>
  <li>Have your medication list ready</li>
  <li>Consider bringing a family member or friend</li>
  <li>Don't be afraid to ask for clarification</li>
</ul>

<div class="tip">
Good preparation helps make the most of your time with your healthcare provider.
</div>`;
    }
    
    return `
<h3>Health Support Message</h3>
<p>Thank you for reaching out. I'm here to support you on your health journey.</p>

<div class="tip">
For the best medical guidance, please:
<ul>
  <li>Consult with your healthcare providers</li>
  <li>Keep them informed about any changes in your condition</li>
  <li>Don't hesitate to ask questions during appointments</li>
  <li>Trust your instincts - if something doesn't feel right, contact your medical team</li>
</ul>
</div>

<div class="alert">
I'm here to listen and support you, but your healthcare providers are your best resource for medical decisions.
</div>`;
  }

  buildContextualMessage(userMessage, patientContext) {
    let contextualMessage = userMessage;
    
    if (patientContext.condition) {
      contextualMessage += `\n\nPatient has been diagnosed with ${patientContext.condition}.`;
    }
    
    if (patientContext.treatmentStage) {
      contextualMessage += `\n\nCurrent treatment stage: ${patientContext.treatmentStage}.`;
    }
    
    if (patientContext.currentTreatments && patientContext.currentTreatments.length > 0) {
      contextualMessage += `\n\nCurrent treatments: ${patientContext.currentTreatments.join(', ')}.`;
    }
    
    if (patientContext.symptoms && patientContext.symptoms.length > 0) {
      contextualMessage += `\n\nRecent symptoms: ${patientContext.symptoms.join(', ')}.`;
    }
    
    return contextualMessage;
  }

  async analyzeSymptoms(symptoms, patientContext = {}) {
    try {
      const symptomAnalysis = await this.generateResponse(
        `Please analyze these symptoms and provide guidance: ${symptoms.join(', ')}. 
         Consider the patient's condition (${patientContext.condition || 'not specified'}) 
         and current treatments (${patientContext.currentTreatments?.join(', ') || 'none specified'}). 
         Provide severity assessment and recommendations for when to contact healthcare providers.`,
        patientContext
      );
      
      return {
        analysis: symptomAnalysis,
        severity: this.assessSymptomSeverity(symptoms),
        recommendations: this.generateSymptomRecommendations(symptoms, patientContext)
      };
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      throw error;
    }
  }

  assessSymptomSeverity(symptoms) {
    const severeSymptoms = [
      'severe pain', 'difficulty breathing', 'chest pain', 'unconsciousness',
      'severe bleeding', 'high fever', 'severe headache', 'confusion'
    ];
    
    const moderateSymptoms = [
      'moderate pain', 'nausea', 'vomiting', 'diarrhea', 'fatigue',
      'loss of appetite', 'mild fever', 'cough'
    ];
    
    const hasSevere = symptoms.some(symptom => 
      severeSymptoms.some(severe => symptom.toLowerCase().includes(severe))
    );
    
    const hasModerate = symptoms.some(symptom => 
      moderateSymptoms.some(moderate => symptom.toLowerCase().includes(moderate))
    );
    
    if (hasSevere) return 'severe';
    if (hasModerate) return 'moderate';
    return 'mild';
  }

  generateSymptomRecommendations(symptoms, patientContext) {
    const recommendations = [];
    
    if (this.assessSymptomSeverity(symptoms) === 'severe') {
      recommendations.push('Contact your healthcare provider immediately or go to the emergency room');
    } else if (this.assessSymptomSeverity(symptoms) === 'moderate') {
      recommendations.push('Contact your healthcare provider within 24 hours');
      recommendations.push('Monitor symptoms closely');
    } else {
      recommendations.push('Continue monitoring symptoms');
      recommendations.push('Contact healthcare provider if symptoms worsen or persist');
    }
    
    return recommendations;
  }

  async generateTreatmentEducation(cancerType, treatmentType) {
    try {
      const education = await this.generateResponse(
        `Please provide comprehensive education about ${treatmentType} for ${cancerType} patients. 
         Include what to expect, common side effects, preparation tips, and recovery guidance.`,
        { cancerType, currentTreatments: [treatmentType] }
      );
      
      return education;
    } catch (error) {
      console.error('Error generating treatment education:', error);
      throw error;
    }
  }

  async generateNutritionGuidance(cancerType, treatmentType, symptoms = []) {
    try {
      const nutritionGuidance = await this.generateResponse(
        `Please provide nutrition guidance for a ${cancerType} patient undergoing ${treatmentType}. 
         Consider these symptoms: ${symptoms.join(', ')}. 
         Include recommended foods, foods to avoid, hydration tips, and meal planning suggestions.`,
        { cancerType, currentTreatments: [treatmentType], symptoms }
      );
      
      return nutritionGuidance;
    } catch (error) {
      console.error('Error generating nutrition guidance:', error);
      throw error;
    }
  }

  async generateMentalHealthSupport(patientContext, currentMood = 'neutral') {
    try {
      const supportMessage = await this.generateResponse(
        `Please provide mental health support and coping strategies for a cancer patient. 
         Current mood: ${currentMood}. 
         Cancer type: ${patientContext.cancerType}. 
         Treatment stage: ${patientContext.treatmentStage}. 
         Include stress management techniques, emotional support resources, and when to seek professional help.`,
        patientContext
      );
      
      return supportMessage;
    } catch (error) {
      console.error('Error generating mental health support:', error);
      throw error;
    }
  }

  async generateAppointmentPreparation(appointmentType, cancerType, treatmentStage) {
    try {
      const preparation = await this.generateResponse(
        `Please provide preparation guidance for a ${appointmentType} appointment. 
         Cancer type: ${cancerType}. 
         Treatment stage: ${treatmentStage}. 
         Include what to bring, questions to ask, and how to prepare mentally and physically.`,
        { cancerType, treatmentStage }
      );
      
      return preparation;
    } catch (error) {
      console.error('Error generating appointment preparation:', error);
      throw error;
    }
  }

  async generateMedicationGuidance(medicationName, cancerType, otherMedications = []) {
    try {
      const guidance = await this.generateResponse(
        `Please provide guidance about ${medicationName} for a ${cancerType} patient. 
         Other medications: ${otherMedications.join(', ')}. 
         Include dosage information, side effects, interactions, and important safety notes.`,
        { cancerType, currentTreatments: [medicationName, ...otherMedications] }
      );
      
      return guidance;
    } catch (error) {
      console.error('Error generating medication guidance:', error);
      throw error;
    }
  }
}

module.exports = new AIService(); 