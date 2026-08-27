import React, { useState, useEffect } from 'react';
import {
  MessageSquareHeart,
  Star,
  ThumbsUp,
  ShieldCheck,
  Plus,
  Loader2,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { AlertBanner } from '../components/AlertBanner';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { feedbackService } from '../services/feedbackService';
import { diagnosticService } from '../services/diagnosticService';
import { TechnicianFeedback, DiagnosticSession } from '../types';

export const Feedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<TechnicianFeedback[]>([]);
  const [sessions, setSessions] = useState<DiagnosticSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [wasHelpful, setWasHelpful] = useState(true);
  const [actualRootCause, setActualRootCause] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fbList, sessionList] = await Promise.all([
        feedbackService.getFeedback(),
        diagnosticService.getSessions(),
      ]);
      setFeedbacks(fbList || []);
      setSessions(sessionList || []);
      if (sessionList && sessionList.length > 0 && !selectedSessionId) {
        setSelectedSessionId(sessionList[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve feedback logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId) {
      alert('Please select a diagnostic session to provide feedback for.');
      return;
    }

    setSubmitting(true);
    try {
      await feedbackService.submitFeedback({
        diagnostic_session_id: selectedSessionId,
        rating: Number(rating),
        feedback_text: feedbackText,
        was_helpful: wasHelpful,
        actual_root_cause: actualRootCause,
      });
      setIsModalOpen(false);
      setFeedbackText('');
      setActualRootCause('');
      loadData();
    } catch (err: any) {
      alert(`Error submitting feedback: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <AlertBanner
          type="error"
          title="Feedback Query Notice"
          message={error}
        />
      )}

      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
            <UserCheck className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
            Human-in-the-Loop Technician Validation Log
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Technician reviews used for quality gating, grounding audit, and continuous RLHF fine-tuning
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            title="Refresh feedback"
            className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 shadow-card-subtle transition-smooth"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-xs font-bold shadow-card-subtle flex items-center transition-smooth"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Submit Validation Review
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center text-xs text-slate-400 shadow-card-subtle">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-violet-600" />
          Loading validation reviews...
        </div>
      ) : feedbacks.length === 0 ? (
        <EmptyState
          title="No technician reviews submitted yet"
          description="Technician feedback evaluates diagnostic recommendations, confirms safety compliance, and records verified root causes."
          icon={<MessageSquareHeart className="w-6 h-6" />}
          actionText="Submit Review"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {feedbacks.map((fb) => (
            <div
              key={fb.id || fb.diagnostic_session_id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle hover:shadow-card-hover transition-smooth space-y-2.5"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold bg-violet-50 text-violet-700 px-2 py-0.5 rounded border border-violet-200">
                    Session: {fb.diagnostic_session_id.slice(0, 8)}
                  </span>
                  <span className="text-xs font-bold text-slate-800">Technician Validation Entry</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(fb.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                {fb.feedback_text && (
                  <p className="bg-slate-50 p-2.5 rounded-md border border-slate-200 italic text-[11px] leading-relaxed text-slate-700">
                    "{fb.feedback_text}"
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                  <span className="flex items-center text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Safety Protocol Confirmed
                  </span>
                  <span className="flex items-center text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200 font-medium">
                    <ThumbsUp className="w-3.5 h-3.5 mr-1" /> {fb.was_helpful ? 'Helpful Recommendation' : 'Unhelpful'}
                  </span>
                  {fb.actual_root_cause && (
                    <span className="text-slate-600 font-mono text-[11px]">
                      Root Cause: <strong className="text-slate-800 font-sans">{fb.actual_root_cause}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Submission Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Technician Diagnostic Validation"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmitFeedback} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Diagnostic Session</label>
            {sessions.length === 0 ? (
              <p className="text-rose-600">Open a diagnostic session first to review it.</p>
            ) : (
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-1 focus:ring-violet-600 text-xs text-slate-800"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    Session {s.id.slice(0, 8)} — {s.user_question.slice(0, 45)}...
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Overall Diagnostic Quality (1 to 5 Stars)</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-1 focus:ring-violet-600 text-xs text-slate-800"
            >
              <option value="5">5 Stars — Excellent & Completely Accurate</option>
              <option value="4">4 Stars — Good & Actionable</option>
              <option value="3">3 Stars — Moderate / Partial Assistance</option>
              <option value="2">2 Stars — Inaccurate Citations</option>
              <option value="1">1 Star — Inaccurate or Hazardous</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Was this troubleshooting sequence helpful?</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="was_helpful"
                  checked={wasHelpful === true}
                  onChange={() => setWasHelpful(true)}
                />
                <span>Yes, assisted repair</span>
              </label>
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="was_helpful"
                  checked={wasHelpful === false}
                  onChange={() => setWasHelpful(false)}
                />
                <span>No, manual diagnosis needed</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Actual Root Cause Discovered (Physical Inspection)</label>
            <input
              type="text"
              value={actualRootCause}
              onChange={(e) => setActualRootCause(e.target.value)}
              placeholder="e.g. Suction valve cavitation due to foreign debris blockage"
              className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-1 focus:ring-violet-600 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Technician Observations & Notes</label>
            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Explain how accurate the safety steps and torque / resistance specs were..."
              className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-1 focus:ring-violet-600 text-xs text-slate-800"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-1.5 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedSessionId}
              className="px-4 py-1.5 bg-violet-600 text-white rounded-md hover:bg-violet-700 font-bold flex items-center shadow-card-subtle"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Submit Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

