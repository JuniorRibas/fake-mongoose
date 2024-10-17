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

  await cupom_logs.create({
    codigo: "ribasPromo",
  });
}

query();
