const PRIMITIVE_TYPES = {
    STRING: "STRING",
    BOOLEAN: "BOOLEAN",
    INT: "INT",
    FLOAT: "FLOAT",
    WILDCARD: "WILDCARD"
}
const USER_DEFINED_TYPES = {
    OBJECT: "OBJECT"
}
const DERIVED_TYPES = {
    FUNCTION: "FUNCTION",
    EVENT: "EVENT"
}

function registerPrimitiveType(type, value) {
    PRIMITIVE_TYPES[type] = value;
}
function unregisterPrimitiveType(type) {
    delete PRIMITIVE_TYPES[type];
}

function registerUserDefinedType(type, value) {
    USER_DEFINED_TYPES[type] = value;
}
function unregisterUserDefinedType(type) {
    delete USER_DEFINED_TYPES[type];
}

function registerDerivedType(type, value) {
    DERIVED_TYPES[type] = value;
}
function unregisterDerivedType(type) {
    delete DERIVED_TYPES[type];
}

export { PRIMITIVE_TYPES, USER_DEFINED_TYPES, DERIVED_TYPES };