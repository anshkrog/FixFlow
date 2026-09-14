function ResidentSkeleton({ rows = 3 }) {
    return (
        <div className="resident-skeleton-list">

            {Array.from({ length: rows }).map((_, index) => (

                <div
                    className="resident-skeleton-card"
                    key={index}
                >

                    <div className="resident-skeleton-top">

                        <div className="skeleton-line resident-skeleton-id" />

                        <div className="skeleton-line resident-skeleton-status" />

                    </div>


                    <div className="skeleton-line resident-skeleton-title" />

                    <div className="skeleton-line resident-skeleton-description" />

                    <div className="skeleton-line resident-skeleton-description short" />


                    <div className="resident-skeleton-meta">

                        <div className="skeleton-line resident-skeleton-chip" />

                        <div className="skeleton-line resident-skeleton-chip" />

                        <div className="skeleton-line resident-skeleton-chip small" />

                    </div>


                    <div className="resident-skeleton-progress">

                        <div className="skeleton-line resident-skeleton-progress-label" />

                        <div className="skeleton-line resident-skeleton-progress-bar" />

                    </div>

                </div>

            ))}

        </div>
    );
}

export default ResidentSkeleton;