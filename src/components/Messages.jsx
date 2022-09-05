/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import Attachment from '../icons/Attachment';
import Send from '../icons/Send';

function Messages({ handleSubmit, text, setText, setImage }) {
  return (
    <div className="message_form_container">
      <label htmlFor="img">
        <Attachment />
      </label>
      <input
        type="file"
        id="img"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => setImage(e.target.files[0])}
      />
      <div>
        <input
          type="text"
          placeholder="enter message"
          className="message_input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button type="button" onClick={handleSubmit}>
          <Send />
        </button>
      </div>
    </div>
  );
}

export default Messages;
