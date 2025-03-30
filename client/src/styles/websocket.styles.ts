export const styles = {
  websocketDemo: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },

  connectionControls: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },

  input: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.2s',
    outline: 'none',
  },

  buttons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },

  button: {
    padding: '10px 18px',
    backgroundColor: '#4361ee',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },

  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
    opacity: 0.7,
  },

  statusIndicator: {
    padding: '10px',
    borderRadius: '6px',
    textAlign: 'center' as const,
    fontWeight: 'bold',
    marginBottom: '10px',
    transition: 'background-color 0.3s',
  },

  statusConnecting: {
    backgroundColor: '#ffca3a',
    color: '#333',
  },

  statusOpen: {
    backgroundColor: '#43aa8b',
    color: 'white',
  },

  statusClosed: {
    backgroundColor: '#f94144',
    color: 'white',
  },

  statusError: {
    backgroundColor: '#f94144',
    color: 'white',
  },

  messagesContainer: {
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  },

  messagesList: {
    height: '350px',
    overflowY: 'auto' as const,
    padding: '15px',
    backgroundColor: 'white',
  },

  message: {
    marginBottom: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    maxWidth: '80%',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const,
    clear: 'both' as const,
    wordBreak: 'break-word' as const,
    display: 'inline-block' as const,
  },

  messageClient: {
    backgroundColor: '#4361ee',
    color: 'white',
    float: 'right' as const,
    borderBottomRightRadius: '4px',
  },

  messageServer: {
    backgroundColor: '#f8f9fa',
    color: '#212529',
    float: 'left' as const,
    borderBottomLeftRadius: '4px',
    border: '1px solid #e9ecef',
  },

  messageSender: {
    fontWeight: 'bold',
    marginRight: '5px',
    marginBottom: '4px',
    display: 'block' as const,
    fontSize: '13px',
  },

  messageText: {
    fontSize: '14px',
    lineHeight: '1.4',
  },

  messageTime: {
    fontSize: '11px',
    opacity: 0.7,
    marginTop: '5px',
    display: 'block' as const,
    textAlign: 'right' as const,
  },

  messageInput: {
    display: 'flex',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e9ecef',
  },

  messageInputField: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    marginRight: '10px',
    outline: 'none',
    fontSize: '14px',
  },

  title: {
    color: '#333',
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
};
