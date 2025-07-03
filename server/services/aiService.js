const OpenAI = require('openai');

class AIService {
  constructor() {
    // Only initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.isAvailable = true;
    } else {
      this.isAvailable = false;
      console.log('OpenAI API key not configured. AI features will be limited.');
    }
    
    // Cancer-specific system prompts
    this.cancerContext = `
      You are a compassionate AI health assistant specifically designed to support cancer patients. 
      Your role is to provide helpful, accurate, and supportive information while always encouraging 
      patients to consult with their healthcare providers for medical decisions.
      
      Key principles:
      - Always prioritize patient safety and well-being
      - Provide evidence-based information about cancer treatments and symptoms
      - Offer emotional support and coping strategies
      - Encourage regular communication with healthcare providers
      - Never make definitive medical diagnoses
      - Always recommend consulting healthcare professionals for medical decisions
      - Be empathetic and understanding of the patient's journey
      
      Cancer types you can provide information about:
      - Breast cancer
      - Lung cancer
      - Prostate cancer
      - Colorectal cancer
      - Leukemia
      - Lymphoma
      - And other common cancer types
      
      Treatment modalities you can discuss:
      - Chemotherapy
      - Radiation therapy
      - Surgery
      - Immunotherapy
      - Targeted therapy
      - Hormone therapy
      - Stem cell transplantation
      
      Always remind patients that you are an AI assistant and cannot replace professional medical care.
    `;
  }

  async generateResponse(userMessage, patientContext = {}) {
    try {
      // If AI is not available, return a fallback response
      if (!this.isAvailable) {
        return this.getFallbackResponse(userMessage, patientContext);
      }

      // Cache functionality removed for simplicity
      // const cacheKey = `ai_response:${Buffer.from(userMessage).toString('base64')}`;
      // const cachedResponse = await getCache(cacheKey);
      // if (cachedResponse) {
      //   console.log('AI response served from cache');
      //   return cachedResponse;
      // }

      const messages = [
        {
          role: 'system',
          content: this.cancerContext
        },
        {
          role: 'user',
          content: this.buildContextualMessage(userMessage, patientContext)
        }
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const aiResponse = response.choices[0].message.content;
      
      // Cache functionality removed for simplicity
      // await setCache(cacheKey, aiResponse, 3600);
      
      console.log('AI response generated successfully');
      return aiResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getFallbackResponse(userMessage, patientContext);
    }
  }

  getFallbackResponse(userMessage, patientContext = {}) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword-based responses when AI is not available
    if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('feel')) {
      return `I understand you're experiencing symptoms. While I can't provide specific medical advice, I recommend:
      
1. Monitor your symptoms closely
2. Contact your healthcare provider if symptoms worsen
3. Keep a symptom diary to share with your medical team
4. Don't hesitate to seek emergency care for severe symptoms

Remember: I'm here to support you, but always consult with your healthcare providers for medical decisions.`;
    }
    
    if (lowerMessage.includes('treatment') || lowerMessage.includes('therapy') || lowerMessage.includes('medication')) {
      return `Regarding your treatment questions, I recommend:

1. Discuss all treatment options with your oncologist
2. Ask about potential side effects and how to manage them
3. Follow your treatment plan as prescribed
4. Keep track of any side effects you experience
5. Don't hesitate to ask questions during appointments

Your healthcare team is the best source for treatment-specific guidance.`;
    }
    
    if (lowerMessage.includes('appointment') || lowerMessage.includes('doctor') || lowerMessage.includes('visit')) {
      return `For your upcoming appointment, I suggest:

1. Write down your questions beforehand
2. Bring a list of current symptoms
3. Have your medication list ready
4. Consider bringing a family member or friend
5. Don't be afraid to ask for clarification

Preparation helps make the most of your time with your healthcare provider.`;
    }
    
    return `Thank you for reaching out. I'm here to support you on your health journey. 

For the best medical guidance, please:
- Consult with your healthcare providers
- Keep them informed about any changes in your condition
- Don't hesitate to ask questions during appointments
- Trust your instincts - if something doesn't feel right, contact your medical team

I'm here to listen and support you, but your healthcare providers are your best resource for medical decisions.`;
  }

  buildContextualMessage(userMessage, patientContext) {
    let contextualMessage = userMessage;
    
    if (patientContext.cancerType) {
      contextualMessage += `\n\nPatient has been diagnosed with ${patientContext.cancerType}.`;
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
         Consider the patient's cancer type (${patientContext.cancerType || 'not specified'}) 
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