using {sap.capire.senioritycalc as my} from '../db/schema';
using ECEmploymentInformation from './external/ECEmploymentInformation.csn';

service EmployeeService @(requires : 'authenticated-user') {

    // Expose external SFSF API for demo purpose
    entity Employee      as projection on my.Employee;

    // Simulate events for local test
    action simulateEvent(userId : String, hireDate : String, terminationDate : String, originalStartDate : String, status : String);

    entity EmpEmployment as projection on ECEmploymentInformation.EmpEmployment {
        userId,
        startDate,
        originalStartDate
    };

    event EmployeeEvent {
        userId            : String;
        hireDate          : String;
        terminationDate   : String;
        originalStartDate : String;
        status            : String;
    }
}
