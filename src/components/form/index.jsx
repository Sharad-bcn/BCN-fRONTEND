import React, { createRef } from 'react';

export default function Main({ children, style, className }) {
  const ref = createRef();

  const handleKeyDown = (e) => {
    // On enter key press
    if (e.key === 'Enter') {
      // If not textarea
      if (e.target.tagName !== 'TEXTAREA') {
        // Prevent calling first button "onClick" method
        e.preventDefault();

        // Call "onClick" of button having attribute "submit"
        const submitButton = ref.current.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.click();
        }
      }
    }
  };

  return (
    <form
      className={className}
      style={style}
      onSubmit={(e) => e.preventDefault()}
      onKeyDown={handleKeyDown}
      spellCheck="false"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      ref={_ref => (ref.current = _ref)}
    >
      {children}
    </form>
  );
}
