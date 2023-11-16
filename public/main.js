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
  
 
    const displayEmployees = (employees) => {
      let employeeHTML = '<ul>'; 
      employees.forEach(function(employee) {
        employeeHTML += `<li>${employee.emp_name}</li>`; 
      });
      employeeHTML += '</ul>';
      $('#list').html(employeeHTML);
    };
  
    
    $('#getallemps').click(function() {
      employeesFetch(); 
    });
  });