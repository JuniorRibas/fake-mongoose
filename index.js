import "dotenv/config";
import { ObjectId } from "mongodb";
import { cupom_logs } from "./models/CuponsLogs.model.js";
import { leadsUpdate } from "./models/LeadsUpdate.model.js";

async function query() {
  //   const results = await Promise.all([
  //     await cupom_logs.findOne({ codigo: "off15" }).exec(),
  //     await cupom_logs.findOne({ codigo: "promoblack35" }).exec(),
  //     await cupom_logs.findOne({ codigo: "15off" }).exec(),
  //   ]);
  //   console.log(results);
  //   const cupom = await cupom_logs.findOne({ codigo: "promoRIbas" });
  //   cupom.count = cupom.count + 1;
  //   await cupom.save();
  //   leadsUpdate.find().sort({ _id: -1 }).limit(1).exec();

  // const cupom = await cupom_logs.findOne({ codigo: "promoRIbas" });
  // const cupom2 = await cupom_logs.findById(cupom._id);
  // await cupom_logs.findByIdAndUpdate(cupom._id, { $inc: { count: 1 } });
}

query();
