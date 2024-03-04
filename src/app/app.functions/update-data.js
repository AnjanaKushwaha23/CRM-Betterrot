const hubspot = require("@hubspot/api-client");

// exports.main = async (context = {}) => {
//   const { hs_object_id } = context.propertiesToSend;
//   const { form_data } = context.parameters;
//   const { formValue } = form_data;
//   let paramValues = {};
//   let paramIds = {};
//   for (let id in formValue) {
//     paramIds[id] = id;
//     paramValues[id] = formValue[id];
//     console.log(`ID: ${id}, Value: ${formValue[id]}`);
//   }
//   for (let id in paramIds) {
//     await updateDealProperties( paramValues[id], id);
//     console.log(hs_object_id, paramValues[id], id)
//   }
//   return { status: "SUCCESS", deal_id: hs_object_id, param: formValue };
// };

exports.main = async (context = {}) => {
  try {
    const { hs_object_id } = context.propertiesToSend;
    const { form_data } = context.parameters;
    const { formValue } = form_data;
    let paramValues = {};
    let paramIds = {};
    for (let id in formValue) {
      paramIds[id] = id;
      paramValues[id] = formValue[id];
    }
    for (let id in paramIds) {
      await updateDealProperties(paramValues[id], id);
    }
    return { status: "SUCCESS", deal_id: hs_object_id, param: formValue };
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

async function updateDealProperties(softwareArray, propid) {
  const hubSpotClient = new hubspot.Client({
    accessToken: process.env["PRIVATE_APP_ACCESS_TOKEN"],
  });

  // console.log(softwareArray,'softwareArray')

  const properties = {
    software_sold: softwareArray.join(";"),
  };
  const SimplePublicObjectInput = { properties };
  const objectType = "properties";
  const objectId = propid;
  console.log(objectId, "checkingID");
  const idProperty = undefined;

  try {
    const apiResponse = await hubSpotClient.crm.objects.basicApi.update(
      objectType,
      objectId,
      SimplePublicObjectInput,
      idProperty
    );
    // console.log(JSON.stringify(apiResponse, null, 2));
  } catch (e) {
    e.message === "HTTP request failed"
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
}


