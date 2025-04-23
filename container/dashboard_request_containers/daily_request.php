<div class="request-conent-div">
    <div class="single-date-div">
        <div class="start-date-div">
            <span id="start-date-span">Select Start Date: </span>
            <input id="start-date-input" type="date">
        </div>
        <button id="filter-date-search-btn" type="button" class="btn btn-secondary">Search</button>
    </div>

    <h1>Daily Requests Report</h1>
    
    <div class="request-graph-div">
        <canvas id="requestsPerHourChart" ></canvas>
        <div class="request-tally-div">
            <div class="total-request-div">
                <span>Total Request</span>
                <span id="total-request-value">0</span>
            </div>
            <div class="total-request-ot-div">
                <span>Total Overdue Request</span>
                <span id="total-request-ot-value">0</span>
            </div>
        </div>
    </div>
</div>