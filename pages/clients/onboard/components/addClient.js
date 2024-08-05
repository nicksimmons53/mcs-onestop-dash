import React, {useRef} from "react";
import {
  Box,
  Button,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr, useDisclosure
} from "@chakra-ui/react";
import {FiChevronDown, FiChevronUp, FiPlus, FiUploadCloud, FiX} from "react-icons/fi";
import {useFieldArray, useForm} from "react-hook-form";
import {useSelector} from "react-redux";
import {useGetOnboardUserByIdQuery} from "../../../../src/services/onboardUser";
import {useUser} from "@auth0/nextjs-auth0";
import s3 from "../../../../lib/s3";

// TODO: add alert to cancel function
// TODO: readd required variable
export default function AddClient({ isOpen, onClose }) {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    name: "contacts",
    control
  });
  const billingAddrDisc = useDisclosure();
  const shippingAddrDisc = useDisclosure();
  const contactsDisc = useDisclosure();
  const [files, setFiles] = React.useState([]);
  const fileRef = useRef();
  const { user, isLoading, error } = useUser();
  // const onboardUser = useGetOnboardUserByIdQuery({ sub: user.sub });

  const handleFileButtonClick = (e) => {
    // fileRef.current.click();
  }

  const uploadFiles = (e) => {
    // setFiles([...files, ...e.target.files]);
  }

  const clearFile = (name) => {
    // const newFiles = files.filter(file => file.name !== name);
    // setFiles([...newFiles]);
  }

  const onSubmit = (data) => {
    // let userInfo = onboardUser.data;
    // // let filePath = `mcs-onboard-${userInfo.email.split("@")[0]}-${userInfo.sageEmployeeNumber}/${data.clientName}/`;
    // // console.log(filePath)
    // console.log(userInfo)
    // let response = s3.createBucket(`${userInfo.sageUserId}-${userInfo.sageEmployeeNumber}`);
    // console.log(response);
    // // console.log(data);
    // // console.log(files);
  }

  return (
    <Drawer isOpen={isOpen} placement={"right"} onClose={onClose} size={"lg"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth={1}>
          Add Client
        </DrawerHeader>

        <DrawerBody>
          <form onSubmit={handleSubmit(onSubmit)} id={"add-client-form"}>
            <Box borderBottomWidth={1}>
              <Box my={2}>
                <Heading size={"md"} mb={1}>Basic Information</Heading>
                <FormControl isInvalid={errors.clientName} my={2}>
                  <FormLabel>Client Name</FormLabel>
                  <Input
                    id={"clientName"}
                    placeholder={"Name"}
                    {...register("clientName", {
                      //required: "Required Field",
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.clientName && errors.clientName.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl isInvalid={errors.territory} my={2}>
                  <FormLabel>Territory</FormLabel>
                  <Select
                    placeholder={"Select"}
                    id={"territory"}
                    {...register("territory", {
                      //required: "Required Field"
                    })}>
                    <option value={"Austin"}>Austin</option>
                    <option value={"Dallas"}>Dallas</option>
                    <option value={"Houston"}>Houston</option>
                    <option value={"San Antonio"}>San Antonio</option>
                  </Select>
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.territory && errors.territory.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>
              </Box>
            </Box>

            <Box borderBottomWidth={1}>
              <Box my={2}>
                <Heading size={"md"} mb={1}>Corporate Address</Heading>
                <FormControl my={2} isInvalid={errors.corporate?.address1}>
                  <FormLabel>Address 1</FormLabel>
                  <Input
                    id={"corporate.address1"}
                    placeholder={"Street Name"}
                    {...register("corporate.address1", {
                      //required: "Required Field",
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.corporate?.address1 && errors.corporate?.address1.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.corporate?.address2}>
                  <FormLabel>Address 2</FormLabel>
                  <Input
                    id={"corporate.address2"}
                    placeholder={"Apt/Unit/Ste"}
                    {...register("corporate.address2", {
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.corporate?.address2 && errors.corporate?.address2.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.corporate?.city}>
                  <FormLabel>City</FormLabel>
                  <Input
                    id={"corporate.city"}
                    placeholder={"City Name"}
                    {...register("corporate.city", {
                      //required: "Required Field",
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.corporate?.city && errors.corporate?.city.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.corporate?.state}>
                  <FormLabel>State</FormLabel>
                  <Input
                    id={"corporate.state"}
                    placeholder={"(i.e. TX/CA/OK)"}
                    {...register("corporate.state", {
                      //required: "Required Field",
                      maxLength: { value: 2, message: "Should be in abbreviated format." }
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.corporate?.state && errors.corporate?.state.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.corporate?.zip}>
                  <FormLabel>Zip</FormLabel>
                  <Input
                    id={"corporate.zip"}
                    placeholder={"Zip Code"}
                    {...register("corporate.zip", {
                      //required: "Required Field",
                      pattern: { value: /\d{5}/, message: "Should be a 5 digit zip code." }
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.corporate?.zip && errors.corporate?.zip.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>
              </Box>
            </Box>

            <Box borderBottomWidth={1}>
              <HStack my={2} justifyContent={"space-between"}>
                <Heading size={"md"} mb={1}>Billing Address</Heading>
                <IconButton
                  variant="outline"
                  aria-label="open input"
                  onClick={billingAddrDisc.onToggle}
                  icon={billingAddrDisc.isOpen ? <FiChevronUp /> : <FiChevronDown />}
                />
              </HStack>

              <Collapse in={billingAddrDisc.isOpen}>
                <FormControl my={2} isInvalid={errors.billing?.address1}>
                  <FormLabel>Address 1</FormLabel>
                  <Input
                    id={"billing.address1"}
                    placeholder={"Street Name"}
                    {...register("billing.address1", {
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.billing?.address1 && errors.billing?.address1.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.billing?.address2}>
                  <FormLabel>Address 2</FormLabel>
                  <Input
                    id={"billing.address2"}
                    placeholder={"Apt/Unit/Ste"}
                    {...register("billing.address2", {
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.billing?.address2 && errors.billing?.address2.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.billing?.city}>
                  <FormLabel>City</FormLabel>
                  <Input
                    id={"billing.city"}
                    placeholder={"City Name"}
                    {...register("billing.city", {
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.billing?.city && errors.billing?.city.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.billing?.state}>
                  <FormLabel>State</FormLabel>
                  <Input
                    id={"billing.state"}
                    placeholder={"(i.e. TX/CA/OK)"}
                    {...register("billing.state", {
                      maxLength: { value: 2, message: "Should be in abbreviated format." }
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.billing?.state && errors.billing?.state.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.billing?.zip}>
                  <FormLabel>Zip</FormLabel>
                  <Input
                    id={"billing.zip"}
                    placeholder={"Zip Code"}
                    {...register("billing.zip", {
                      pattern: { value: /\d{5}/, message: "Should be a 5 digit zip code." }
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.billing?.zip && errors.billing?.zip.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>
              </Collapse>
            </Box>

            <Box borderBottomWidth={1}>
              <HStack my={2} justifyContent={"space-between"}>
                <Heading size={"md"} mb={1}>Shipping Address</Heading>
                <IconButton
                  variant="outline"
                  aria-label="open input"
                  onClick={shippingAddrDisc.onToggle}
                  icon={shippingAddrDisc.isOpen ? <FiChevronUp /> : <FiChevronDown />}
                />
              </HStack>

              <Collapse in={shippingAddrDisc.isOpen}>
                <FormControl my={2} isInvalid={errors.shipping?.address1}>
                  <FormLabel>Address 1</FormLabel>
                  <Input
                    id={"shipping.address1"}
                    placeholder={"Street Name"}
                    {...register("shipping.address1", {
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.shipping?.address1 && errors.shipping?.address1.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.shipping?.address2}>
                  <FormLabel>Address 2</FormLabel>
                  <Input
                    id={"shipping.address2"}
                    placeholder={"Apt/Unit/Ste"}
                    {...register("shipping.address2", {
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.shipping?.address2 && errors.shipping?.address2.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.shipping?.city}>
                  <FormLabel>City</FormLabel>
                  <Input
                    id={"shipping.city"}
                    placeholder={"City Name"}
                    {...register("shipping.city", {
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.shipping?.city && errors.shipping?.city.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.shipping?.state}>
                  <FormLabel>State</FormLabel>
                  <Input
                    id={"shipping.state"}
                    placeholder={"(i.e. TX/CA/OK)"}
                    {...register("shipping.state", {
                      maxLength: { value: 2, message: "Should be in abbreviated format." }
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.shipping?.state && errors.shipping?.state.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>

                <FormControl my={2} isInvalid={errors.shipping?.zip}>
                  <FormLabel>Zip</FormLabel>
                  <Input
                    id={"shipping.zip"}
                    placeholder={"Zip Code"}
                    {...register("shipping.zip", {
                      pattern: { value: /\d{5}/, message: "Should be a 5 digit zip code." }
                    })}
                  />
                  <HStack justifyContent={"flex-end"}>
                    <FormErrorMessage>
                      {errors.shipping?.zip && errors.shipping?.zip.message}
                    </FormErrorMessage>
                  </HStack>
                </FormControl>
              </Collapse>
            </Box>

            <Box>
              <HStack my={2} justifyContent={"space-between"}>
                <Heading size={"md"} mb={1}>Files</Heading>
                <Button rightIcon={<FiUploadCloud/>} colorScheme={"blue"} variant={"outline"} onClick={handleFileButtonClick}>
                  Upload
                </Button>
                <Input type={"file"} hidden ref={fileRef} id={"file"} onChange={uploadFiles} multiple />
              </HStack>

              <TableContainer borderWidth={1} borderRadius={5}>
                <Table variant={"simple"}>
                  <Thead>
                    <Tr>
                      <Th>File Name</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {files.length === 0 &&
                      <Tr>
                        <Td>No Files Uploaded</Td>
                        <Td></Td>
                      </Tr>
                    }

                    {files.length !== 0 && files.map((file, index) => (
                      <Tr key={file.name}>
                        <Td>{file.name}</Td>
                        <Td>
                          <HStack justifyContent={"flex-end"}>
                            <IconButton
                              variant="outline"
                              aria-label="clear file"
                              icon={<FiX/>}
                              onClick={() => clearFile(file.name)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </form>
        </DrawerBody>

        <DrawerFooter borderTopWidth={1}>
          <Button variant='outline' mr={3} onClick={onClose} colorScheme={"red"}>
            Cancel
          </Button>
          <Button colorScheme={"blue"} type={"submit"} isLoading={isSubmitting} form={"add-client-form"}>
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}