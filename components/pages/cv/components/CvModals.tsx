import React from 'react';
import { CVSettings } from '@/types';
import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/model';
import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model';
import { RankedStory } from '@/types/adjustment';
import ManualAdjustmentModal from '../modals/ManualAdjustmentModal';
import MotivationalLetterModal from '../modals/MotivationalLetterModal';
import TranslationModal from '../modals/TranslationModal';
import PositionAnalysisModal from '../modals/PositionAnalysisModal';
import PreferredProjectsModal from '../modals/PreferredProjectsModal';
import ExtensionDownload from '../ExtensionDownload';
import PasswordModal from '@/components/auth/PasswordModal';

interface CvModalsProps {
  // Modal state
  manualAdjustmentModalOpen: boolean;
  motivationalLetterModalOpen: boolean;
  translationModalOpen: boolean;
  positionAnalysisModalOpen: boolean;
  preferredProjectsModalOpen: boolean;
  extensionModalOpen: boolean;
  showPasswordModal: boolean;

  // Modal actions
  closeModal: (modalType: string) => void;
  openModal: (modalType: string) => void;

  // Data
  checked: string[];
  motivationalLetter: MotivationalLetterResponse | null;
  editableMotivationalLetter: MotivationalLetterResponse | null;
  positionIntersection: JobCvIntersectionResponse | null;
  reduxCvProps: CVSettings;
  companyName: string | null;
  positionDetails: string;
  selectedLanguage: string;
  rankedStories: RankedStory[];

  // State setters
  setEditableMotivationalLetter: (letter: MotivationalLetterResponse | null) => void;
  setPositionDetails: (details: string) => void;
  setIsManualAdjustmentMinimized: (minimized: boolean) => void;
  setManualOtherChanges: (changes: string) => void;

  // Current state values
  isManualAdjustmentMinimized: boolean;
  manualOtherChanges: string;
  loading: boolean;

  // Event handlers
  handleManualRefinement: (data: any) => Promise<void>;
  handleAdjustForPosition: (pos: string, checked: string[], lang: string) => Promise<void>;
  handleDownloadMotivationalLetterPDF: () => void;
  handleAdjustLetter: (comments: string, pos: string, lang: string) => Promise<void>;
  handleTranslateBoth: () => Promise<void>;
  getMotivationalLetter: any;
  handleLanguageChange: any;
  handleChecked: (value: string) => () => void;
  updatePositionIntersection: () => Promise<void>;
  setsnackbarMessage: (msg: string) => void;
}

export function CvModals({
  // Modal state
  manualAdjustmentModalOpen,
  motivationalLetterModalOpen,
  translationModalOpen,
  positionAnalysisModalOpen,
  preferredProjectsModalOpen,
  extensionModalOpen,
  showPasswordModal,

  // Modal actions
  closeModal,
  openModal,

  // Data
  checked,
  motivationalLetter,
  editableMotivationalLetter,
  positionIntersection,
  reduxCvProps,
  companyName,
  positionDetails,
  selectedLanguage,
  rankedStories,

  // State setters
  setEditableMotivationalLetter,
  setPositionDetails,
  setIsManualAdjustmentMinimized,
  setManualOtherChanges,

  // Current state
  isManualAdjustmentMinimized,
  manualOtherChanges,
  loading,

  // Event handlers
  handleManualRefinement,
  handleAdjustForPosition,
  handleDownloadMotivationalLetterPDF,
  handleAdjustLetter,
  handleTranslateBoth,
  getMotivationalLetter,
  handleLanguageChange,
  handleChecked,
  updatePositionIntersection,
  setsnackbarMessage,
}: CvModalsProps) {
  return (
    <>
      {/* Extension Download Modal */}
      <ExtensionDownload
        open={extensionModalOpen}
        onClose={() => closeModal('extension')}
      />

      {/* Manual Adjustment Modal */}
      <ManualAdjustmentModal
        open={manualAdjustmentModalOpen}
        onClose={() => {
          closeModal('manualAdjustment');
          setIsManualAdjustmentMinimized(false);
        }}
        checkedImprovements={checked}
        onRefineCV={handleManualRefinement}
        isLoading={loading}
        _companyName={companyName}
        positionDetails={positionDetails}
        setPositionDetails={setPositionDetails}
        onAdjustForPosition={() => handleAdjustForPosition(positionDetails, checked, selectedLanguage)}
        isMinimized={isManualAdjustmentMinimized}
        onToggleMinimize={() => setIsManualAdjustmentMinimized(!isManualAdjustmentMinimized)}
        otherChanges={manualOtherChanges}
        setOtherChanges={setManualOtherChanges}
      />

      {/* Motivational Letter Modal */}
      <MotivationalLetterModal
        open={motivationalLetterModalOpen}
        onClose={() => closeModal('motivationalLetter')}
        motivationalLetter={motivationalLetter}
        editableMotivationalLetter={editableMotivationalLetter}
        setEditableMotivationalLetter={setEditableMotivationalLetter}
        onDownloadPDF={handleDownloadMotivationalLetterPDF}
        onAdjustLetter={(comments: string) =>
          handleAdjustLetter(comments, positionDetails, selectedLanguage)
        }
        onTranslateLetter={handleTranslateBoth}
        onGenerateLetter={getMotivationalLetter}
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange}
        isLoading={loading}
        companyName={companyName}
        positionDetails={positionDetails}
        setPositionDetails={setPositionDetails}
        checked={checked}
        _handleChecked={handleChecked}
        candidate={reduxCvProps}
      />

      {/* Translation Modal */}
      <TranslationModal
        open={translationModalOpen}
        onClose={() => closeModal('translation')}
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange}
        onTranslateBoth={handleTranslateBoth}
        hasMotivationalLetter={!!motivationalLetter}
        isLoading={loading}
      />

      {/* Position Analysis Modal */}
      <PositionAnalysisModal
        open={positionAnalysisModalOpen}
        onClose={() => closeModal('positionAnalysis')}
        positionIntersection={positionIntersection}
        checked={checked}
        _handleChecked={handleChecked}
        _onOpenManualAdjustments={() => {
          closeModal('positionAnalysis');
          openModal('manualAdjustment');
        }}
        onOpenQuickAdjustments={() => {
          closeModal('positionAnalysis');
          openModal('manualAdjustment');
          setIsManualAdjustmentMinimized(true);
        }}
        _companyName={companyName}
        positionDetails={positionDetails}
        setPositionDetails={setPositionDetails}
        onAnalyzePosition={updatePositionIntersection}
        isLoading={loading}
        setsnackbarMessage={setsnackbarMessage}
      />

      {/* Preferred Projects Modal */}
      <PreferredProjectsModal
        open={preferredProjectsModalOpen}
        onClose={() => closeModal('preferredProjects')}
        positionDetails={positionDetails}
        existingRankedStories={rankedStories}
      />

      {/* Password Modal */}
      <PasswordModal
        open={showPasswordModal}
        onClose={() => closeModal('password')}
      />
    </>
  );
}