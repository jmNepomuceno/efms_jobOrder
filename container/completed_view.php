<div class="completed-view">
    <h1>Integrated Hospital Operations and Management Program</h1>
    <div class="table-container">
        <table id="completed-dataTable">
            <thead>
                <tr>
                    <th>JOB ORDER NO.</th>
                    <th>NAME OF END USER</th>
                    <th>DATE</th>
                    <th>REQUEST TYPE</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div> 

<div class="modal fade" id="modal-view-completed-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-top modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">View Request Form</h5>
            </div>
            <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                <div class="main-information">

                    <div class="user-info">
                        <i class="fa-solid fa-user"></i>
                        <div class="user-details">
                            <p><strong> <span id="user-what">Requester</span> Name:</strong> <span id="user-name">John Marvin Nepomuceno</span></p>
                            <p><strong>BioID:</strong> <span id="user-bioid">4497</span></p>
                            <p><strong>Division:</strong> <span id="user-division">Finance Division</span></p>
                            <p><strong>Section:</strong> <span id="user-section">Accounting Section</span></p>
                        </div>
                    </div>

                    <!-- Job Order Information -->
                    <div class="job-order-info">
                        <h5 class="info-heading">Job Order Request Information</h5>
                        <p><strong>Job Order ID:</strong> <span id="job-order-id">JO-2025-001</span></p>
                        <p><strong>Date Requested:</strong> <span id="date-requested">March 11, 2025</span></p>
                        <p><strong>Request Type:</strong> <span id="request-type">IT Support</span></p>
                    </div>
                </div>

                <div class="request-description">
                    <h5 class="info-heading">Request Description</h5>
                    <p id="request-description">
                        The workstation in the accounting office has encountered a persistent issue where the system fails to load critical accounting software.
                    </p>
                </div>

                <div class="tech-assessment-section">
                    <h5 class="info-heading">Technician Correction Details</h5>
                    <div class="tech-info-assessment">
                        <span><b>Technician Name:</b> <i id="tech-name-i">Dell Waje</i></span>
                        <span><b>Reception Date:</b> <i id="reception-date-i">03030303030303</i></span>
                    </div>
                    <textarea class="tech-remarks-textarea" placeholder="Currently assessing..."></textarea>
                </div>


            </div>
            <div class="modal-footer">
                <button id="close-modal-btn" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-eval-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header custom-header">
                <h5 id="modal-title-incoming" class="modal-title-incoming">Evaluation Form</h5>
            </div>

            <!-- Modal Body -->
            <div id="modal-body-incoming" class="modal-body-incoming p-4">
                <form id="evaluation-form">
                    <p class="text-muted">Please rate the service based on the following criteria:</p>

                    <div class="table-responsive">
                        <table class="table table-bordered text-center evaluation-table">
                            <thead class="table-light">
                                <tr>
                                    <th class="text-start">Criteria</th>
                                    <th>Very Satisfactory</th>
                                    <th>Satisfactory</th>
                                    <th>Unsatisfactory</th>
                                    <th>Poor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-start">1. Requested troubleshooting/repairs attended within prescribed schedule. (2 hours Turn-around time)</td>
                                    <td><input type="radio" name="q1" value="Very Satisfactory" required></td>
                                    <td><input type="radio" name="q1" value="Satisfactory"></td>
                                    <td><input type="radio" name="q1" value="Unsatisfactory"></td>
                                    <td><input type="radio" name="q1" value="Poor"></td>
                                </tr>
                                <tr>
                                    <td class="text-start">2. IMISS staff gives updates on the status of the job request.</td>
                                    <td><input type="radio" name="q2" value="Very Satisfactory" required></td>
                                    <td><input type="radio" name="q2" value="Satisfactory"></td>
                                    <td><input type="radio" name="q2" value="Unsatisfactory"></td>
                                    <td><input type="radio" name="q2" value="Poor"></td>
                                </tr>
                                <tr>
                                    <td class="text-start">3. Accomplished service job request with high levels of quality.</td>
                                    <td><input type="radio" name="q3" value="Very Satisfactory" required></td>
                                    <td><input type="radio" name="q3" value="Satisfactory"></td>
                                    <td><input type="radio" name="q3" value="Unsatisfactory"></td>
                                    <td><input type="radio" name="q3" value="Poor"></td>
                                </tr>
                                <tr>
                                    <td class="text-start">4. IMISS staff are courteous and helpful.</td>
                                    <td><input type="radio" name="q4" value="Very Satisfactory" required></td>
                                    <td><input type="radio" name="q4" value="Satisfactory"></td>
                                    <td><input type="radio" name="q4" value="Unsatisfactory"></td>
                                    <td><input type="radio" name="q4" value="Poor"></td>
                                </tr>
                                <tr>
                                    <td class="text-start">5. Timely response from IMISS staff was given.</td>
                                    <td><input type="radio" name="q5" value="Very Satisfactory" required></td>
                                    <td><input type="radio" name="q5" value="Satisfactory"></td>
                                    <td><input type="radio" name="q5" value="Unsatisfactory"></td>
                                    <td><input type="radio" name="q5" value="Poor"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="mb-3">
                        <label for="comment" class="form-label">Comments/Suggestions for Improvement (Optional):</label>
                        <textarea class="form-control custom-textarea" id="comment" name="comment" rows="3"></textarea>
                    </div>

                    <!-- Modal Footer -->
                    <div class="modal-footer custom-footer">
                        <button id="close-modal-btn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
