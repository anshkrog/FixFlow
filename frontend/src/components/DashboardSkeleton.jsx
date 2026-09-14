function DashboardSkeleton({ rows = 3 }) {
    return (
        <div className="fixflow-skeleton-list">

            {Array.from({ length: rows }).map((_, index) => (

                <div
                    className="fixflow-skeleton-card"
                    key={index}
                >

                    <div className="skeleton-main">

                        <div className="skeleton-top-row">

                            <div className="skeleton-line skeleton-id" />

                            <div className="skeleton-line skeleton-badge" />

                        </div>


                        <div className="skeleton-line skeleton-title" />

                        <div className="skeleton-line skeleton-description" />

                        <div className="skeleton-line skeleton-description short" />


                        <div className="skeleton-meta">

                            <div className="skeleton-line skeleton-meta-item" />

                            <div className="skeleton-line skeleton-meta-item" />

                            <div className="skeleton-line skeleton-meta-item" />

                        </div>

                    </div>


                    <div className="skeleton-side">

                        <div className="skeleton-line skeleton-label" />

                        <div className="skeleton-line skeleton-select" />

                        <div className="skeleton-line skeleton-label" />

                        <div className="skeleton-line skeleton-select" />

                    </div>

                </div>

            ))}

        </div>
    );
}

export default DashboardSkeleton;