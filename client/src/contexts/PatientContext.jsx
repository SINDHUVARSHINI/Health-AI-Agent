import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { patientService } from '@services/patientService';
import { useAuth } from './AuthContext';

const PatientContext = createContext();

const initialState = {
  patient: null,
  isLoading: true,
  error: null
};

const patientReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PATIENT_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case 'FETCH_PATIENT_SUCCESS':
      return {
        ...state,
        patient: action.payload,
        isLoading: false,
        error: null
      };
    
    case 'FETCH_PATIENT_FAILURE':
      return {
        ...state,
        patient: null,
        isLoading: false,
        error: action.payload
      };
    
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patient: { ...state.patient, ...action.payload }
      };
    
    case 'CLEAR_PATIENT':
      return {
        ...state,
        patient: null,
        isLoading: false,
        error: null
      };
    
    default:
      return state;
  }
};

export const PatientProvider = ({ children }) => {
  const [state, dispatch] = useReducer(patientReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'patient') {
      fetchPatientData();
    } else if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_PATIENT' });
    }
  }, [isAuthenticated, user]);

  const fetchPatientData = async () => {
    try {
      dispatch({ type: 'FETCH_PATIENT_START' });
      const patient = await patientService.getPatientProfile();
      dispatch({
        type: 'FETCH_PATIENT_SUCCESS',
        payload: patient
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_PATIENT_FAILURE',
        payload: error.message
      });
    }
  };

  const updatePatient = (patientData) => {
    dispatch({
      type: 'UPDATE_PATIENT',
      payload: patientData
    });
  };

  const refreshPatientData = () => {
    fetchPatientData();
  };

  const value = useMemo(() => ({
    ...state,
    updatePatient,
    refreshPatientData
  }), [state, updatePatient, refreshPatientData]);

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

PatientProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PatientContext; 