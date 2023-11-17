$(document).ready(function() {

    const employeesFetch = () => {
        $.ajax({
            url: '/employees',
            type: 'GET',
            success: function(data) {
            displayEmployees(data);
            },
            error: function() {
            $('#list').html('<p>Error fetching employees</p>');
            }
        });
    };
    const departmentsFetch = () => {
        $.ajax({
            url: '/departments',
            type: 'GET',
            success: function(data) {
            displayDepartments(data);
            },
            error: function() {
            $('#list').html('<p>Error fetching departments</p>');
            }
        });
    };
 
    const displayEmployees = (employees) => {
        let employeeHTML = '<ul>'; 
        employees.forEach(function(employee) {
        employeeHTML += `<p id="listEmpID">EMPLOYEE ID: ${employee.emp_id} Dept ID: ${employee.dep_id}<br> 
                        <p id="listEmpName">NAME: <span id="empName"> ${employee.emp_name}</span>.</p>
                        <p><span id="listSkills">SKILLS:</span> ${employee.skill_one} | ${employee.skill_two} | ${employee.skill_three}</pre></p>
                        <br>
                        <button type="button" id="editEmployee${employee.emp_id}" class="editButton">>> Edit</button><br>
                        <button type="button" id="expungeEmployeeNumber${employee.emp_id}" class="expungeButton">>> Expunge Employee ${employee.emp_id}</button>
                        <br><br><br>`; 
        });
        employeeHTML += '</ul>';
        $('#list').html(employeeHTML);
        $('.expungeButton').click(function(){
            const employeeId = this.id.replace('expungeEmployeeNumber','');
            console.log(employeeId)
            deleteEmployee(employeeId);
        })
        $(`.editButton`).click(function() {
            console.log("Working")
            const employeeId = this.id.replace('editEmployee', '');
            console.log(`Editing employee: ${employeeId}`);
            $(`#employeeForm`).addClass('hidden')
            $(`#editForm`).removeClass('hidden')
            $(`#stopEdit`).removeClass('hidden')
            $.ajax({
                url: `/employees/${employeeId}`,
                type: 'GET',
                success: function(employeeData) {
                    console.log(employeeData)
                    $('#editEmpName').val(employeeData.emp_name);
                    $('#editDepId').val(employeeData.dep_id);
                    $('#editSkillOne').val(employeeData.skill_one);
                    $('#editSkillTwo').val(employeeData.skill_two);
                    $('#editSkillThree').val(employeeData.skill_three);
                    $('#editForm').submit(function(event) {
                        event.preventDefault();
                        const updatedData = {
                            emp_name: $('#editEmpName').val(),
                            dep_id: $('#editDepId').val(),
                            skill_one: $('#editSkillOne').val(),
                            skill_two: $('#editSkillTwo').val(),
                            skill_three: $('#editSkillThree').val()
                        };
        
                        $.ajax({
                            url: `/employees/${employeeId}`,
                            type: 'PUT',
                            contentType: 'application/json',
                            data: JSON.stringify(updatedData),
                            success: function(updatedEmployee) {
                                console.log('Employee updated:', updatedEmployee);
                                employeesFetch(); 
                            },
                            error: function(error) {
                                console.error('Error updating employee:', error);
                                console.log(updatedData)
                            }
                        });
                    });    
                },
                
                error: function(error) {
                    console.error('Error fetching employee details:', error);
                }

            });
        });
    };

    const displayDepartments = (departments) => {
        let departmentHTML = '<ul>';
        departments.forEach(function(departments) {
            departmentHTML += `<p><h2>${departments.dep_name}</h2>--------------------
                               <p>Department Responsibilities: ${departments.resp}</p><br>`;
        });
        departmentHTML += '</ul>';
        $('#list').html(departmentHTML);
    };
    
    const deleteEmployee = (employeeId) => {
        $.ajax({
            url: `/employees/${employeeId}`,
            type: 'DELETE',
            success: function(){
                employeesFetch();
            },
            error: function(){
                $('#list').html(`<p>Error Deleting Employee number ${employeeId}</p>`);
            }
        })
    }
  
    $('#employeeForm').submit(function(event){
        event.preventDefault()
        const formData= {
            emp_name: $('#empName').val(),
            dep_id: $('#depId').val(),
            skill_one: $('#skillOne').val(),
            skill_two: $('#skillTwo').val(),
            skill_three: $('#skillThree').val()
        };
        $.ajax({
            url: '/employees',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                console.log('Employee created:', response)
                employeesFetch()
            },
            error: function(error){
                console.error('Error creating employee:', error)
            }
        })
    })

    $('#getallemps').click(function() {
        employeesFetch(); 
        $('#employeeForm').removeClass('hidden')
        $('#editDepForm').addClass('hidden')
        
    });

    $('#getalldepts').click(function() {
        departmentsFetch();
        $('#employeeForm').addClass('hidden')
        
    })

    $('#stopEdit').click(function() {
        $(`#employeeForm`).removeClass('hidden')
        $(`#editForm`).addClass('hidden')
        $(`#stopEdit`).addClass('hidden')
        console.log('Stop Editing button clicked!');
        
    });
    

  });