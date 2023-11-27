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
  Text,
  Form,
  MultiSelect,
  Button,
} from "@hubspot/ui-extensions";
import { hubspot } from "@hubspot/ui-extensions";

// Define the extension to be run within the Hubspot CRM
hubspot.extend(({ runServerlessFunction }) => (
  <DealsSummary runServerless={runServerlessFunction} />
));

// Define the Extension component, taking in runServerless prop
const DealsSummary = ({ runServerless }) => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deals, setDeals] = useState([]);
  const [formValue, setFormValue] = useState({});
  useEffect(() => {
    // Request statistics data from serverless function
    runServerless({
      name: "get-data",
      propertiesToSend: ["hs_object_id"],
    })
      .then((serverlessResponse) => {
        if (serverlessResponse.status == "SUCCESS") {
          const { response } = serverlessResponse;
          setDeals(response.deals);
          console.log("hello", response.deals);
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
  function MultiSelectControlledExample(e) {
    e.preventDefault();
    console.log(formValue, "hola");
  }
  if (loading) {
    // If loading, show a spinner
    return <LoadingSpinner />;
  }
  if (errorMessage) {
    // If there's an error, show an alert
    return (
      <Alert title="Unable to get deals data" variant="error">
        {errorMessage}
      </Alert>
    );
  }
  return (
    <>
      <Text>Testing</Text>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Properties</TableHeader>
            <TableHeader>Software</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>{deal.properties.property_name}</TableCell>
              <TableCell>
                <Form
                  preventDefault={true}
                  onSubmit={(e) => MultiSelectControlledExample(deal.id, e)}
                >
                  <MultiSelect
                    value={formValue[deal.id] || []}
                    placeholder="Pick your Products"
                    label="Select Mutiple Products"
                    name="selectProduct"
                    required={true}
                    onChange={(value) => setFormValue({...formValue, [deal.id]: value})}
                    options={[
                      { label: "NutureSkill", value: "p1" },
                      { label: "ChatSkill", value: "p2" },
                    ]}
                  />
                  <Button type="submit">Submit</Button>
                </Form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
