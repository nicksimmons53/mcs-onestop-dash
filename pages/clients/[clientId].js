import Head from "next/head";
import {
  Dropdown,
  Grid,
  Menu,
  Table
} from "semantic-ui-react";
import React from "react";
import _ from "lodash";
import Layout from "../../components/layout";
import {useUser} from "@auth0/nextjs-auth0";

const tableHeaders = {
  addresses: [ "Type", "Street Address", "City", "State", "Zip" ],
  contacts: [ "Name", "Title", "Phone", "Email" ],
  files: [ ],
  programs: [ "Chosen Selections" ],
  approvals: [ ]
};

const questions = {
  accounting: [
    "Payment Frequency",
    "Autopay",
    "Email for Submitting Invoices",
    "Payment Type",
    "Payment Portal",
    "Portal URL",
    "PO's Required?",
    "PO's Required for Invoices?",
    "Approval's Required?",
    "Have you attached the contract?",
    "Contact Name",
    "Contact Phone",
    "Contact Email",
    "Notes",
  ],
  cabinets: [
    "Preferred Colors",
    "Preferred Style",
    "Overlay",
    "Preferences on Crown",
    "Bid Type Preferences",
    "Upper Cabinet Standard Specs.",
    "Vanity Height Standard Specs.",
    "Is Soft Close Standard?",
    "Any Areas Optioned Out?",
    "Notes"
  ],
  carpet: [
    "Preferred Padding Brand",
    "Who Will be Doing Takeoffs?",
    "Waste Factor Percentage",
    "Notes"
  ],
  countertops: [
    "Preferred Material Thickness",
    "Preferred Edge",
    "Waterfall Sides - Standard or Option?",
    "Faucet Holes?",
    "Stove Range Specifications",
    "Who Will be Doing Takeoffs?",
    "Waste Factor Percentage",
    "Notes"
  ],
  expediting: [
    "Is there a vendor portal?",
    "Vendor Portal URL",
    "Has the Vendor Portal Account been created?",
    "Portal Username",
    "Portal Password",
    "How are jobs released?",
    "PO Correction Handling?",
    "Estimated Number of Homes per Year",
    "Estimated Start Date",
    "Is the client using the In-House Program?",
    "Notes"
  ],
  tile: [
    "Floor Setting Material",
    "Floor Custom Setting Material",
    "Wall Setting Material",
    "Wall Custom Setting Material",
    "Alotted Float",
    "Charge for Extra Float",
    "Waterproofing Method",
    "Waterproofing Method - Shower Floor",
    "Waterproofing Method - Shower Walls",
    "Waterproofing Method - Tub Wall",
    "Who is installing fiberglass?",
    "Will we be installing backerboard?",
    "Punch Out Material",
    "Shower Niche Construction",
    "Shower Niche Framing",
    "Preformed Shower Niche Brand",
    "Are Corner Soap Dishes Standard?",
    "Corner Soap Dish Material",
    "Shower Seat Construction",
    "Metal Edge Options",
    "Grout Joint Sizing",
    "Grout Joint Notes",
    "Preferred Grout Brand",
    "Upgraded Grout and Formula",
    "Grout Product",
    "Subfloor Std. Practice",
    "Subfloor Products",
    "Wall Tile Height Standard",
    "Who Will be Doing Takeoffs?",
    "Waste Factor Percentage",
    "Waste Factor Percentage - Walls",
    "Waste Factor Percentage - Floors",
    "Waste Factor Percentage - Mosaics",
    "Notes"
  ],
  woodVinyl: [
    "Preferred Glue Products",
    "Other Glue Product",
    "Stain or Primed?",
    "Are Transition Strips Standard Practice?",
    "HVAC Requirement?",
    "MC Surfaces Install Wood Trim?",
    "2nd Story Subfloor Construction",
    "Who Will be Doing Takeoffs?",
    "Waste Factor Percentage",
    "Notes"
  ]
};

export default function Client({ data }) {
  const { user } = useUser();
  const [ activeView, setActiveView ] = React.useState("Basic Information");
  const [ selectedDept, setSelectedDept ] = React.useState("Select Program");
  let client = data;
  let selections = Object.keys(data.selections).filter(program => data.selections[program] === 1);
  let programs = data.programs;
  let files = undefined;

  const handleItemClick = (e, { name }) => setActiveView(name);

  const handleDropdownClick = (e, { value }) => setSelectedDept(value);

  const handleMenuItemClick = async(e, { value }) => {
    let email = user.email.split("@")[0];
    const requestOptions = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: email, decision: value })
    }

    await fetch(`https://onboard.mcsurfacesinc.com/admin/clients/status/${client.basicInfo.id}`, requestOptions)
      .then((res) => console.log(res));
  };

  return (
    <Layout>
      <Head>
        <title>MCS | {client.basicInfo.name}</title>
      </Head>

      <Menu stackable>
        <Menu.Item header>{client.basicInfo.name}</Menu.Item>
        <Menu.Item name={"Basic Information"} active={activeView === "Basic Information"} onClick={handleItemClick} color={"blue"}/>
        <Menu.Item name={"Accounting Details"} active={activeView === "Accounting Details"} onClick={handleItemClick} color={"blue"}/>
        <Menu.Item name={"Expediting Details"} active={activeView === "Expediting Details"} onClick={handleItemClick} color={"blue"}/>
        <Menu.Item name={"Program Details"} active={activeView === "Program Details"} onClick={handleItemClick} color={"blue"}/>
        <Menu.Item name={"Pricing Breakdown"} active={activeView === "Pricing Breakdown"} onClick={handleItemClick} color={"blue"}/>
        { activeView === "Pricing Breakdown" &&
          <Dropdown item text={selectedDept}>
            <Dropdown.Menu>
              <Dropdown.Item text={"Countertops"} value={"Countertops"} onClick={handleDropdownClick} active={selectedDept === "Countertops"}/>
              <Dropdown.Item text={"Flooring"} value={"Flooring"} onClick={handleDropdownClick} active={selectedDept === "Flooring"}/>
            </Dropdown.Menu>
          </Dropdown>
        }
        <Menu.Item position={"right"}>
          <Dropdown button text={"Actions"} fluid floating>
            <Dropdown.Menu>
              <Dropdown.Item value={1} onClick={handleMenuItemClick}>Approve</Dropdown.Item>
              <Dropdown.Item value={0} onClick={handleMenuItemClick}>Decline</Dropdown.Item>
              <Dropdown.Item>Cancel</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Menu>

      { activeView === "Basic Information" && <BasicInfo data={data} selections={selections} files={files}/> }
      { activeView === "Accounting Details" && data.tables !== undefined && <Details data={data.tables.accounting_details} questions={questions.accounting}/> }
      { activeView === "Expediting Details" && data.tables !== undefined && <Details data={data.tables.expediting_details} questions={questions.expediting}/> }
      { activeView === "Program Details" && <ProgramDetails programs={programs} selections={selections}/> }
      { activeView === "Pricing Breakdown" && selectedDept !== "" && <PricingBreakdown data={data.parts} dept={selectedDept}/> }
    </Layout>
  )
}

const BasicInfo = ({ data, selections, files }) => (
  <Grid>
    <Grid.Row columns={2} stretched>
      <Grid.Column computer={16} largeScreen={8} mobile={16} tablet={16} widescreen={8}>
        <Grid.Row>
          <Table selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={'5'}>
                  Addresses
                </Table.HeaderCell>
              </Table.Row>

              <Table.Row>
                { tableHeaders.addresses.map((header) => (
                  <Table.HeaderCell key={header}>{ header }</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              { data.addresses.map((address, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{ address.type }</Table.Cell>
                  <Table.Cell>{ address.address }</Table.Cell>
                  <Table.Cell>{ address.city }</Table.Cell>
                  <Table.Cell>{ address.state }</Table.Cell>
                  <Table.Cell>{ address.zip }</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Grid.Row>
      </Grid.Column>

      <Grid.Column computer={16} largeScreen={8} mobile={16} tablet={16} widescreen={8}>
        <Grid.Row>
          <Table selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={'4'}>
                  Contacts
                </Table.HeaderCell>
              </Table.Row>

              <Table.Row>
                { tableHeaders.contacts.map((header) => (
                  <Table.HeaderCell key={header}>{ header }</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>

              {data.contacts === undefined || data.contacts.length === 0 ?
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>No Data Present</Table.Cell>
                  </Table.Row>
                </Table.Body>
                :
                <Table.Body>
                  {data.contacts.map((contact, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{contact.name}</Table.Cell>
                      <Table.Cell>{contact.title}</Table.Cell>
                      <Table.Cell>{contact.phone}</Table.Cell>
                      <Table.Cell>{contact.email}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              }
          </Table>
        </Grid.Row>
      </Grid.Column>
    </Grid.Row>

    <Grid.Row columns={1} stretched>
      <Grid.Column computer={10} largeScreen={10} mobile={16} tablet={16} widescreen={8}>
        <Grid.Row>
          <Table striped selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={'1'}>
                  Files
                </Table.HeaderCell>
              </Table.Row>

              {files === undefined ?
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>No Data Present</Table.Cell>
                  </Table.Row>
                </Table.Body>
                :
                <Table.Row>
                </Table.Row>
              }
            </Table.Header>

            <Table.Body>
            </Table.Body>
          </Table>
        </Grid.Row>
      </Grid.Column>

      <Grid.Column computer={3} largeScreen={3} mobile={16} tablet={16} widescreen={8}>
        <Grid.Row>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={'1'}>
                  Programs
                </Table.HeaderCell>
              </Table.Row>

              <Table.Row>
                <Table.HeaderCell>Chosen Selections</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            {selections === undefined || selections.length === 0 ?
              <Table.Body>
                <Table.Row>
                  <Table.Cell>No Data Present</Table.Cell>
                </Table.Row>
              </Table.Body>
              :
              <Table.Body>
                {selections.map(program => (
                  <Table.Row key={program}>
                    <Table.Cell>{program[0].toUpperCase()}{program.slice(1)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            }
          </Table>
        </Grid.Row>
      </Grid.Column>

        <Grid.Column computer={3} largeScreen={3} mobile={16} tablet={16} widescreen={8}>
          <Grid.Row>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan={'3'}>
                    Approvals
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              { data.approvals === undefined ?
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>No Data Present</Table.Cell>
                  </Table.Row>
                </Table.Body>
                :
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Edyth Cruz</Table.Cell>
                    <Table.Cell>{ data.approvals["Edyth Cruz"] === 1 ? "Approved" : data.approvals["Edyth Cruz"] === 0 ? "Declined" : "No Response" }</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Kim Conover</Table.Cell>
                    <Table.Cell>{ data.approvals["Kim Conover"] === 1 ? "Approved" : data.approvals["Kim Conover"] === 0 ? "Declined" : "No Response" }</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Lisa Kallus</Table.Cell>
                    <Table.Cell>{ data.approvals["Lisa Kallus"] === 1 ? "Approved" : data.approvals["Lisa Kallus"] === 0 ? "Declined" : "No Response" }</Table.Cell>
                  </Table.Row>
                </Table.Body>
              }
            </Table>
          </Grid.Row>
        </Grid.Column>
    </Grid.Row>
  </Grid>
)

const Details = ({ questions, data }) => (
  <Grid centered>
    <Grid.Column width={12}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Questions</Table.HeaderCell>
            <Table.HeaderCell>Response</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          { data !== undefined && data && Object.keys(data).map((key, index) => {
            delete data.clientId;

            return (
              <Table.Row key={index}>
                <Table.Cell>{ questions[index] }</Table.Cell>
                <Table.Cell>
                  {
                    data[key] === 0 ? "No" :
                      data[key] === 1 ? "Yes" :
                        data[key]
                  }
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </Grid.Column>
  </Grid>
)

const ProgramDetails = ({ selections, programs }) => {
  const [ program, setProgram ] = React.useState(null);
  let options = selections.map(program => ({
    key: program,
    value: program,
    text: program[0].toUpperCase() + program.slice(1)
  }));

  console.log(programs, selections, program)

  const handleChange = (e, { value }) => {
    if (value === "wood" || value === "vinyl") {
      setProgram("woodVinyl");
    } else {
      setProgram(value);
    }
  }

  return (
    <Grid centered>
      <Grid.Column width={12}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={'2'}>
                <Dropdown
                  placeholder={options.length !== 0 ? "Select Program" : "No Program Data Found"}
                  selection
                  disabled={options.length === 0}
                  options={options}
                  onChange={handleChange}
                />
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Questions</Table.HeaderCell>
              <Table.HeaderCell>Response</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {programs[program] !== undefined && Object.keys(programs[program][0]).map((key, index) => {
              delete programs[program][0].clientId;
              delete programs[program][0].id;
              delete programs[program][0].version;

              return (
                <Table.Row key={index}>
                  <Table.Cell>{questions[program][index]}</Table.Cell>
                  <Table.Cell>
                    {
                      programs[program][0][key] === 0 ? "No" :
                        programs[program][0][key] === 1 ? "Yes" :
                          programs[program][0][key]
                    }
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Grid.Column>
    </Grid>
  )
}

const PricingBreakdown = ({ data, dept }) => {
  let programs;
  if (dept === "") {
    programs = [];
  } else if (dept === "Countertops") {
    programs = [...data.countertops];
  } else if (dept === "Flooring") {
    programs = [...data.carpet, ...data.tile, ...data.vinyl, ...data.wood];
  }

  let tables = _.mapValues(_.groupBy(programs, "programTable"), tList => tList.map(table => _.omit(table, "programTable")));
  let numOfTables = Object.keys(tables).length;

  return (
    <Grid centered>
      <Grid.Row columns={3}>
      <Grid.Column>
        { Object.keys(tables).slice(0, numOfTables/3).map((table, index) => (
            <Table key={table}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan={4}>{ table }</Table.HeaderCell>
                </Table.Row>

                <Table.Row>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Unit</Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>Billing Amount</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              { tables[table].length === 0 || tables[table] === undefined ?
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>No Data Present</Table.Cell>
                  </Table.Row>
                </Table.Body>
                :
                <Table.Body>
                  { tables[table].map((part, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{ part.Description }</Table.Cell>
                      <Table.Cell>{ part.Unit }</Table.Cell>
                      <Table.Cell textAlign={"right"}>{ parseFloat(part.BillingAmount).toFixed(2) }</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              }
            </Table>
          ))}
        </Grid.Column>
        <Grid.Column>
          { Object.keys(tables).slice(numOfTables/3, numOfTables*(2/3)).map((table) => (
            <Table key={table}>
              <Table.Header>
                <Table.Row color={"blue"}>
                  <Table.HeaderCell colSpan={4}>{ table }</Table.HeaderCell>
                </Table.Row>

                <Table.Row>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Unit</Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>Billing Amount</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              { tables[table].length === 0 || tables[table] === undefined ?
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>No Data Present</Table.Cell>
                  </Table.Row>
                </Table.Body>
                :
                <Table.Body>
                  { tables[table].map((part, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{ part.Description }</Table.Cell>
                      <Table.Cell>{ part.Unit }</Table.Cell>
                      <Table.Cell textAlign={"right"}>{ parseFloat(part.BillingAmount).toFixed(2) }</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              }
            </Table>
          ))}
        </Grid.Column>
        <Grid.Column>
          { Object.keys(tables).slice(numOfTables*(2/3)).map((table) => (
            <Table key={table}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan={4}>{ table }</Table.HeaderCell>
                </Table.Row>

                <Table.Row>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Unit</Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>Billing Amount</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              { tables[table].length === 0 || tables[table] === undefined ?
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>No Data Present</Table.Cell>
                  </Table.Row>
                </Table.Body>
                :
                <Table.Body>
                  { tables[table].map((part, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{ part.Description }</Table.Cell>
                      <Table.Cell>{ part.Unit }</Table.Cell>
                      <Table.Cell textAlign={"right"}>{ parseFloat(part.BillingAmount).toFixed(2) }</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              }
            </Table>
          ))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export async function getStaticPaths() {
  const res = await fetch("https://onboard.mcsurfacesinc.com/admin/clients");
  const data = await res.json( );

  const paths = data.clients.map((client) => ({
    params: { clientId: `${client.clientId}` }
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const clientRes = await fetch(`https://onboard.mcsurfacesinc.com/admin/clients/${params.clientId}/profile-data`);
  const programsRes = await fetch(`https://onboard.mcsurfacesinc.com/admin/clients/programs/${params.clientId}`);
  const detailsRes = await fetch(`https://onboard.mcsurfacesinc.com/admin/clients/details?clientId=${params.clientId}`);
  const partsRes = await fetch(`https://onboard.mcsurfacesinc.com/admin/clients/pricing/${params.clientId}`);
  let data = { };

  await Promise.all([
    clientRes.json( ),
    programsRes.json( ),
    detailsRes.json( ),
    partsRes.json( )
  ]).then((values) => {
    data = values;
  });

  return {
    props: { data: Object.assign({ }, ...data) },
    revalidate: 10
  }
}
