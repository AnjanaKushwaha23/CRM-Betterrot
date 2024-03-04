import React, { useState, useEffect } from "react";
import {
  Alert,
  LoadingSpinner,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Form,
  MultiSelect,
  Button,
  Flex,
} from "@hubspot/ui-extensions";
import { hubspot } from "@hubspot/ui-extensions";
import "./DealsSummary.css"

hubspot.extend(({ runServerlessFunction }) => (
  <DealsSummary runServerless={runServerlessFunction} />
));

const DealsSummary = ({ runServerless }) => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deals, setDeals] = useState([]);
  const [formValue, setFormValue] = useState({});
  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false); //Used for alert message

  useEffect(() => {
    runServerless({
      name: "get-data",
      propertiesToSend: ["hs_object_id"],
    })
      .then((serverlessResponse) => {
        if (serverlessResponse.status == "SUCCESS") {
          const { response } = serverlessResponse;
          setDeals(response.deals);
        } else {
          setErrorMessage(serverlessResponse.message);
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [runServerless]);

  function handleBottomFormSubmit() {
    runServerless({
      name: "update-data",
      propertiesToSend: ["hs_object_id"],
      parameters: {
        "form_data": {
          "formValue": formValue
        }
       }
    })
    .then((serverlessResponse) => {
      if (serverlessResponse.status == "SUCCESS") {
        console.log(JSON.stringify(serverlessResponse));
        setShowSuccess(true);
      } else {
        setErrorMessage(serverlessResponse.message);
      }
    })
    .catch((error) => {
      setErrorMessage(error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }
  

  function handleTopFormSubmit() {
    const updatedFormValue = {};
    deals.forEach((deal) => {
      updatedFormValue[deal.id] = selectedSoftware;
    });
    setFormValue(updatedFormValue);
  }

  function handleSoftwareSelect(value) {
    setSelectedSoftware(value);
  }

  if (loading) {
    return <LoadingSpinner />;
  }
  if (errorMessage) {
    return (
      <Alert title="Unable to get deals data" variant="error">
        {errorMessage}
      </Alert>
    );
  }
  return (
    <>
     {showSuccess && <Alert title="Success" variant="success">Submitted successfully</Alert>}
      <Form preventDefault={true} onSubmit={handleTopFormSubmit}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Property Name</TableHeader>
              <TableHeader>Skill/s Sold Previously</TableHeader>
              <TableHeader>
              <Flex  gap={'small'} direction={'column'}>
                <MultiSelect
                  value={selectedSoftware}
                  placeholder="Select Skill/s"
                  label="Skill/s Sold Now"
                  name="selectSoftware"
                  required={true}
                  onChange={handleSoftwareSelect}
                  options={[
                    { label: "NurtureSkill", value: "NurtureSkill" },
                    { label: "ChatSkill", value: "ChatSkill" },
                  ]}
                />
                <Button type="submit">Apply to All</Button>
                </Flex>
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>{deal.properties.property_name}</TableCell>
                <TableCell>{deal.properties.new_property_sold}</TableCell>
                <TableCell>
                  <MultiSelect
                    value={formValue[deal.id] || []}
                    placeholder="Select Skill/s"
                    label="Skill/s Sold Now"
                    name="Software Sold"
                    required={true}
                    onChange={(value) =>
                      setFormValue({ ...formValue, [deal.id]: value })
                    }
                    options={[
                      { label: "NurtureSkill", value: "NurtureSkill" },
                      { label: "ChatSkill", value: "ChatSkill" },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Form>
      <Button type="submit" onClick={handleBottomFormSubmit}>Submit</Button>
    </>
  );
};
