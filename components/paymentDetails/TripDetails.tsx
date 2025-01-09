'use client';

import { DatePicker, Form, InputNumber, Radio, message } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
};

interface Buttons {
  [key: string]: string;
}

interface Placeholders {
  [key: string]: string;
}

interface TripProps {
  languageData: {
    back: string;
    trip: string;
    dates: string;
    rent: string;
    paymentText: string;
    billingText: string;
    buttons: Buttons;
    priceDetails: string;
    cFee: string;
    sFee: string;
    total: string;
    placeholders: Placeholders;
  };
  stocks: {
    personMax: number;
    roomMax: number;
    bedMax: number;
    available: boolean;
  };
}

export default function TripDetails({ languageData }: TripProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const [ form ] = Form.useForm();
  const initialDates =
    searchParams.get("checkIn") && searchParams.get("checkOut")
      ? [dayjs(searchParams.get("checkIn")), dayjs(searchParams.get("checkOut"))]
      : null;
  const roomsAvailable = Number(searchParams.get("roomMax"));
  const bedsAvailable = Number(searchParams.get("bedMax"));
  const [editMode, setEditMode] = useState({ dates: false, type: false });

  const handleCancel = (field: "dates" | "type") => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    form.resetFields();
  };

  const handleSubmit = (values: { RangePicker: [dayjs.Dayjs, dayjs.Dayjs]; selection: string; beds: number; rooms: number }) => {
    message.success("Changes saved successfully!");
    setEditMode( { dates: false, type: false } );
    
    console.log(values)
  };

  return (
    <Form
      onFinish={handleSubmit}
      form={form}
      {...formItemLayout}
      className="bg-cyan-600 text-white shadow-md"
      layout="vertical"
      style={{ maxWidth: 600, margin: "0 auto", padding: "20px", borderRadius: "8px" }}
      initialValues={{
        RangePicker: initialDates,
        selection: searchParams.get("selection"),
        beds: Number(searchParams.get("beds")),
        rooms: Number(searchParams.get("rooms")),
      }}
    >
      <h2 className="text-xl font-semibold mb-4">{languageData.trip}</h2>

      {/* Dates Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-4"
      >
        {editMode.dates ? (
          <>
            <Form.Item
              label={languageData.dates}
              name="RangePicker"
              rules={[{ required: true, message: "Please select dates!" }]}
            >
              <RangePicker
                disabledDate={(current) => current && current < dayjs().endOf("day")}
              />
            </Form.Item>
            <div className="flex gap-2">
              <button type="submit" className="px-2 py-1 bg-green-600 text-white font-semibold rounded-md">
                Save
              </button>
              <button
                className="bg-slate-400 text-black px-2 py-1 rounded-md"
                onClick={() => handleCancel("dates")}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center w-full">
            <span>
              {initialDates
                ? `${initialDates[0]?.format("YYYY-MM-DD")} to ${initialDates[1]?.format("YYYY-MM-DD")}`
                : "No Dates Selected"}
            </span>
            <motion.button
              className="px-2 py-1 bg-orange-500 text-white font-semibold rounded-md"
              onClick={() => setEditMode((prev) => ({ ...prev, dates: true }))}
              whileTap={{ scale: 0.95 }}
            >
              Edit
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Type Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        {editMode.type ? (
          <>
            <Form.Item
              label={languageData.rent}
              name="selection"
              rules={[{ required: true, message: "Please select an option!" }]}
            >
              <Radio.Group>
                <Radio value="beds">{languageData?.buttons?.beds || "Beds"}</Radio>
                <Radio value="rooms">{languageData?.buttons?.rooms || "Rooms"}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) => prev.selection !== curr.selection}
            >
              {({ getFieldValue }) => {
                const selection = getFieldValue("selection");
                if (selection === "beds") {
                  return (
                    <Form.Item
                      name="beds"
                      label={languageData?.buttons?.beds || "Beds"}
                      rules={[
                        { required: true, message: "Please enter the number of beds!" },
                        { type: "number", min: 1, message: "Must be at least 1 bed!" },
                        {
                          validator: (_, value) =>
                            value <= bedsAvailable ? Promise.resolve() : Promise.reject("Not enough stock available"),
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  );
                }
                if (selection === "rooms") {
                  return (
                    <Form.Item
                      name="rooms"
                      label={languageData?.buttons?.rooms || "Rooms"}
                      rules={[
                        { required: true, message: "Please enter the number of rooms!" },
                        { type: "number", min: 1, message: "Must be at least 1 room!" },
                        {
                          validator: (_, value) =>
                            value <= roomsAvailable ? Promise.resolve() : Promise.reject("Not enough stock available"),
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  );
                }
                return null;
              }}
            </Form.Item>
            <div className="flex gap-2">
              <button type="submit" className="px-2 py-1 bg-green-600 text-white font-semibold rounded-md">
                Save
              </button>
              <button
                className="bg-slate-400 text-black px-2 py-1 rounded-md"
                onClick={() => handleCancel("type")}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center w-full">
            <span>
              {form.getFieldValue("selection") === "beds"
                ? `${form.getFieldValue("beds") || searchParams.get("beds")} Beds Selected`
                : `${form.getFieldValue("rooms") || searchParams.get("rooms")} Rooms Selected`}
            </span>
            <motion.button
              className="px-2 py-1 bg-orange-500 text-white font-semibold rounded-md"
              onClick={() => setEditMode((prev) => ({ ...prev, type: true }))}
              whileTap={{ scale: 0.95 }}
            >
              Edit
            </motion.button>
          </div>
        )}
      </motion.div>
    </Form>
  );
}