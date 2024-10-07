import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import './IssuesPage.css';

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showOpen, setShowOpen] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, [page, showOpen]);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/facebook/react/issues?page=${page}&per_page=10&state=${showOpen ? 'open' : 'closed'}`,
        {
          headers: {
            Authorization: `token PERSONAL_AUTH_TOKEN`
          }
        }
      );
      setIssues((prevIssues) => [...prevIssues, ...response.data]);
      if (response.data.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const fetchMoreIssues = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const toggleIssues = (state) => {
    setShowOpen(state);
    setPage(1);
    setIssues([]);
    setHasMore(true);
  };

  return (
    <div className="issues-page">
      <div className="header">
        <h1>Issues</h1>
        <div className="issue-toggle">
          <button
            className={`toggle-button ${showOpen ? 'active' : ''}`}
            onClick={() => toggleIssues(true)}
          >
            Open Issues
          </button>
          <button
            className={`toggle-button ${!showOpen ? 'active' : ''}`}
            onClick={() => toggleIssues(false)}
          >
            Closed Issues
          </button>
        </div>
        <p>{issues.length} Issues</p>
      </div>
      <InfiniteScroll
        dataLength={issues.length}
        next={fetchMoreIssues}
        hasMore={hasMore}
        loader={<h4>Loading more issues...</h4>}
        endMessage={<p>No more issues to display.</p>}
      >
        {issues.map((issue) => (
          <div key={issue.id} className="issue-card">
            <div className="issue-info">
              <div className="issue-header">
                <span className="issue-title">
                  <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                    {issue.title}
                  </a>
                </span>
                {issue.labels.length > 0 && (
                  <div className="issue-labels">
                    {issue.labels.map((label) => (
                      <span
                        key={label.id}
                        className="issue-label"
                        style={{ backgroundColor: `#${label.color}`, marginRight: '5px' }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="issue-meta">
                <span className={`issue-status ${issue.state}`}>
                  {issue.state === 'open' ? '🟢' : '🔴'}
                </span>
                <span>#{issue.number} opened by {issue.user.login}</span>
              </div>
              <div className="issue-assignee">
                <strong>Assignee: </strong>
                {issue.assignee ? (
                  <span>{issue.assignee.login}</span>
                ) : (
                  <span>No Assignee</span>
                )}
              </div>
            </div>
            {issue.comments > 0 && (
              <div className="issue-comments">
                <span className="comments-icon" aria-hidden="true">💬</span>
                {issue.comments}
              </div>
            )}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default IssuesPage;
