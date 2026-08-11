import React, { useState, useEffect, useRef } from 'react';
import './ContextualFAB.css';

/**
 * SGTIM-019: Adaptive Circular Action Shortcut Button (<ContextualFAB>)
 * Substep 1: Standardized 56x56dp circular FAB pinned in lower right thumb-comfort sector.
 * Substep 2: Active viewport shortcut binding & desktop toolbar transition.
 * Substep 3: Upward unfolding secondary menu expansion animation.
 * Substep 4: Dynamic auto-hide/shrink controller on rapid downward scroll.
 */
export const ContextualFAB = ({ 
  primaryIcon = '⚡', 
  actions = [
    { id: 'create_asset', label: 'Log Asset', icon: '➕', action: () => console.log('Log Asset Triggered') },
    { id: 'switch_view', label: 'Switch Viewport', icon: '🔄', action: () => console.log('Viewport Changed') }
  ],
  userPermissions = ['CREATE_ASSET_LOG', 'SWITCH_CONTEXT'],
  requiredPermission = 'CREATE_ASSET_LOG'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const fabRef = useRef(null);
  const lastScrollY = useRef(0);

  // Mistake-Proofing (Poka-Yoke): Hide completely if account permissions restrict action
  if (!userPermissions.includes(requiredPermission)) {
    return null;
  }

  // Substep 4: Dynamic Hide/Shrink Controller on Rapid Downward Scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current + 12 && currentScrollY > 60) {
        setIsHidden(true);  // Hide button when scrolling down
        setIsOpen(false);   // Collapse sub-menu automatically
      } else if (currentScrollY < lastScrollY.current - 12) {
        setIsHidden(false); // Reveal button when scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Self-Chasing: Collapse sub-menu automatically when user taps outside the frame
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`contextual-fab-container ${isHidden ? 'fab-hidden' : ''}`} ref={fabRef}>
      {/* Substep 3: Secondary Action Menu Unfolding Upward */}
      <div className={`fab-submenu ${isOpen ? 'submenu-expanded' : ''}`}>
        {actions.map((act) => (
          <button
            key={act.id}
            className="fab-submenu-item"
            onClick={() => {
              act.action();
              setIsOpen(false);
            }}
          >
            <span className="submenu-icon">{act.icon}</span>
            <span className="submenu-label">{act.label}</span>
          </button>
        ))}
      </div>

      {/* Substep 1: Main Circular Floating Button (56x56dp Material Design Profile) */}
      <button
        className={`fab-main-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Context Shortcuts"
      >
        <span className="fab-primary-icon">{isOpen ? '✕' : primaryIcon}</span>
      </button>
    </div>
  );
};

export default ContextualFAB;
