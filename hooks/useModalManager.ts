import { useState, useCallback, useMemo } from 'react';

/**
 * Available modal types in the CV page
 */
export type ModalType =
  | 'manualAdjustment'
  | 'motivationalLetter'
  | 'translation'
  | 'positionAnalysis'
  | 'preferredProjects'
  | 'extension'
  | 'password';

/**
 * Modal state interface
 */
export interface ModalState {
  [key: string]: boolean;
}

/**
 * Hook for managing multiple modals in a centralized way
 * Replaces 7 separate useState declarations in cvPage.tsx
 */
export function useModalManager() {
  const [modals, setModals] = useState<ModalState>({
    manualAdjustment: false,
    motivationalLetter: false,
    translation: false,
    positionAnalysis: false,
    preferredProjects: false,
    extension: false,
    password: false,
  });

  /**
   * Opens a specific modal
   */
  const openModal = useCallback((modalType: ModalType) => {
    setModals(prev => ({
      ...prev,
      [modalType]: true
    }));
  }, []);

  /**
   * Closes a specific modal
   */
  const closeModal = useCallback((modalType: ModalType) => {
    setModals(prev => ({
      ...prev,
      [modalType]: false
    }));
  }, []);

  /**
   * Checks if a modal is open
   */
  const isModalOpen = useCallback((modalType: ModalType): boolean => {
    return modals[modalType] || false;
  }, [modals]);

  /**
   * Closes all modals
   */
  const closeAllModals = useCallback(() => {
    setModals({
      manualAdjustment: false,
      motivationalLetter: false,
      translation: false,
      positionAnalysis: false,
      preferredProjects: false,
      extension: false,
      password: false,
    });
  }, []);

  /**
   * Toggles a modal (open if closed, close if open)
   */
  const toggleModal = useCallback((modalType: ModalType) => {
    setModals(prev => ({
      ...prev,
      [modalType]: !prev[modalType]
    }));
  }, []);

  return useMemo(() => ({
    // State
    modals,

    // Actions
    openModal,
    closeModal,
    isModalOpen,
    closeAllModals,
    toggleModal,

    // Convenience getters (for easier migration from existing code)
    manualAdjustmentModalOpen: modals.manualAdjustment,
    motivationalLetterModalOpen: modals.motivationalLetter,
    translationModalOpen: modals.translation,
    positionAnalysisModalOpen: modals.positionAnalysis,
    preferredProjectsModalOpen: modals.preferredProjects,
    extensionModalOpen: modals.extension,
    showPasswordModal: modals.password,
  }), [modals, openModal, closeModal, isModalOpen, closeAllModals, toggleModal]);
}