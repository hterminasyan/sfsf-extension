using EmployeeService as service from '../../srv/emp-service';

annotate service.Employee with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'User ID',
            Value : userId,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Hire Date',
            Value : hireDate,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Termination Date',
            Value : terminationDate,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Original Start Date',
            Value : originalStartDate,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : status,
        },
    ]
);
annotate service.Employee with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'User ID',
                Value : userId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Hire Date',
                Value : hireDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Termination Date',
                Value : terminationDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Original Start Date',
                Value : originalStartDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Status',
                Value : status,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Seniority',
                Value : seniority,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        },
    ]
);
