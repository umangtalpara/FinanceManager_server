try {
    console.log('Loading User...');
    require('./src/models/User');
    console.log('Loading Organization...');
    require('./src/models/Organization');
    console.log('Loading OrgMember...');
    require('./src/models/OrgMember');
    console.log('Loading Project...');
    require('./src/models/Project');
    console.log('Loading Transaction...');
    require('./src/models/Transaction');
    console.log('Loading Category...');
    require('./src/models/Category');
    console.log('Loading AuditLog...');
    require('./src/models/AuditLog');
    console.log('All models loaded successfully.');
} catch (err) {
    console.error('Error loading models:', err);
}
