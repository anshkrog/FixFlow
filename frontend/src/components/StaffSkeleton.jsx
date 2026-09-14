function StaffSkeleton({ rows = 3 }) {
    return (
        <div className="staff-skeleton-list">

            {Array.from({ length: rows }).map((_, index) => (

                <div
                    className="staff-skeleton-card"
                    key={index}
                >
                    <div className="staff-skeleton-content">

                        <div className="staff-skeleton-top">
                            <div className="skeleton-line staff-skeleton-id" />
                            <div className="skeleton-line staff-skeleton-badge" />
                        </div>

                        <div className="skeleton-line staff-skeleton-title" />

                        <div className="skeleton-line staff-skeleton-text" />
                        <div className="skeleton-line staff-skeleton-text short" />

                        <div className="staff-skeleton-meta">
                            <div className="skeleton-line staff-skeleton-chip" />
                            <div className="skeleton-line staff-skeleton-chip" />
                            <div className="skeleton-line staff-skeleton-chip small" />
                        </div>

                    </div>

                    <div className="staff-skeleton-action">

                        <div className="skeleton-line staff-skeleton-label" />

                        <div className="skeleton-line staff-skeleton-action-title" />

                        <div className="skeleton-line staff-skeleton-action-text" />

                        <div className="skeleton-line staff-skeleton-button" />

                    </div>

                </div>

            ))}

        </div>
    );
}

export default StaffSkeleton;