import { IPin } from "../pin";

class ExecPin extends IPin {

    constructor({ uuid = crypto.randomUUID(), name = "IPin", outer = null, type = null, value = null, classId = "ExecPin" } = {}) {

        super({ uuid, name, outer, type, value, classId });

        this.subType = IPin.SUB_TYPES.EXEC;
        this.validSubTypes = new Set([ IPin.SUB_TYPES.EXEC ]);

        this.maxLinks = (type == IPin.TYPES.OUTPUT) ? 1 : 100;

    }

}

export { ExecPin }