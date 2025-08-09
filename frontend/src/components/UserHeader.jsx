function UserHeader({ contact }) {
  return (
    <div className="user-header">
      <div className="avatar">{contact.profile_name.charAt(0)}</div>
      <div className="user-info">
        <h3>{contact.profile_name}</h3>
        <p>{contact.wa_id}</p>
      </div>
      <div className="header-actions">
        <button className="icon-button">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default UserHeader;