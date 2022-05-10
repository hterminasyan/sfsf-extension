module.exports = async srv => {

    const messaging = await cds.connect.to('messaging');
    const sfemp = await cds.connect.to('ECEmploymentInformation');

    const { Employee, EmpEmployment } = srv.entities

    // Using EmpEmployment API
    srv.on('READ', EmpEmployment, async (req) => {
        try {
            return sfemp.run(req.query);
        } catch (err) {
            req.reject(err);
        }
    });

    // Simulate Event to test locally
    srv.on('simulateEvent', async req => {
        try {
            await messaging.tx(req).emit('sap/successfactors/SFPART064985/isc/contractchange',  req.data );
            return {};
        } catch (err) {
            console.error(err);
            return {};
        }
    });

    // Linstening to the SFSF events on contractchange
    messaging.on('sap/successfactors/SFPART064985/isc/contractchange', async (msg) => {
        console.log("<< create event caught", msg);
        try {
            let employee = msg.data
            let id = employee.userId
            let { years, months, days, totalDays } = await calcSeniorityTotalDays(employee)
            console.log(totalDays);
            return {}
        } catch (err) {
            console.error(err);
        }
        
    });

    const calcSeniorityTotalDays = async (employee) => {

        const status = employee.status;
        Object.keys(employee).forEach(key => {
            if (employee[key] === '') {
                employee[key] = null;
            }
        });

        // START SENIORITY RULES

        let hireDate = new Date(employee.hireDate)
        let terminationDate = new Date(employee.terminationDate)
        let originalStartDate = new Date(employee.originalStartDate)
        let diffInMs = null;

        if (status.includes("HIR", 0)) {
            diffInMs = Date.now() - hireDate;
        }
        else if (status.includes("TER", 0)) {
            diffInMs = Math.abs(terminationDate - originalStartDate);
        }
        else if (status.includes("RE", 0)) {
            let history = await srv.run(SELECT.one.from(Employee).where({ userId: employee.userId, status: { like: '%TER%' } }).orderBy('terminationDate desc'));
            if (history != null && history.terminationDate != null) {
                terminationDate = new Date(history.terminationDate)
                diffInMs = Math.abs(hireDate - terminationDate);
                diffInMs = diffInMs > 180 * (1000 * 60 * 60 * 24) ? Date.now() - hireDate : Math.abs(terminationDate - originalStartDate) + Math.abs(Date.now() - hireDate);
            }
        }

        let diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
        let years = Math.floor(diffInDays / 365.25);
        let months = Math.floor(diffInDays % 365.25 / 30);
        let days = Math.floor(diffInDays % 365.25 % 30);

        // END SENIORITY RULES
        employee.seniority = diffInDays
        srv.run(INSERT.into(Employee).entries(employee));

        return { years: years, months: months, days: days, totalDays: diffInDays };
    }

    const getSeniorityPayload = (userId, years, months, days, totalDays) => {
        return {
            "__metadata": {
                "uri": `https://apisalesdemo4.successfactors.com:443/odata/v2/EmpEmployment(personIdExternal='${userId}',userId='${userId}')`,
                "type": "SFOData.EmpEmployment"
            },
            "customString1": years.toString(),
            "customString2": months.toString(),
            "customString3": days.toString(),
            "customString4": totalDays.toString()
        }
    }
}
