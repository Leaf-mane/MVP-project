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
        employeeHTML += `<p>EMPLOYEE ID:${employee.emp_id} Dept ID: ${employee.dep_id}<br> 
                        NAME:${employee.emp_name}.<br>
                        <pre> SKILLS: ${employee.skill_one}, ${employee.skill_two}, ${employee.skill_three}</pre></p><br>
                        <button type="button" id="expungeEmployeeNumber${employee.emp_id}" class="expungeButton">Expunge Employee<br>Number ${employee.emp_id}</button>
                        <br>`; 
        });
        employeeHTML += '</ul>';
        $('#list').html(employeeHTML);
        $('.expungeButton').click(function(){
            const employeeId = this.id.replace('expungeEmployeeNumber','');
            console.log(employeeId)
            deleteEmployee(employeeId);
        })
    };

    const displayDepartments = (departments) => {
        let departmentHTML = '<ul>';
        departments.forEach(function(departments) {
            departmentHTML += `<p><h3>${departments.dep_name}</h3>.
                               <pre>Department Responsibilities: ${departments.resp}</pre></p><br>`;
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
        if($('#employeeForm').hasClass('hidden')){
            $('#employeeForm').removeClass('hidden')
        } else {
            $('#employeeForm').addClass('hidden')
        }
    });

    $('#getalldepts').click(function() {
        departmentsFetch();
    })


  });