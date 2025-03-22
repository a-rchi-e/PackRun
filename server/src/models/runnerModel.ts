import { Model, DataTypes } from "sequelize";
import sequelize from "./model";

export interface RunnerAttributes {
  id?: bigint,
  userId: string,
  latitude: number,
  longitude: number, 
}

class Runner extends Model<RunnerAttributes> implements RunnerAttributes {
  public id!: bigint;
  userId!: string;
  public latitude!: number;
  public longitude!: number;
}

// initializing a new table with sequelize
Runner.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "runner"
  }
);

export default Runner; 