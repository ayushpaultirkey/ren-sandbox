import { IPin } from "../pin";

class ExecPin extends IPin {

    constructor({ uuid = crypto.randomUUID(), name = "IPin", outer = null, type = null, value = null } = {}) {

        super({ uuid, name, outer, type, value });

        this.subType = IPin.SUB_TYPES.EXEC;
        this.validSubTypes = new Set([ IPin.SUB_TYPES.EXEC ]);

    }

}

export { ExecPin }