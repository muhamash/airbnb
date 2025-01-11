'use client';

import { updateSearchParams } from "@/utils/utils";
import { DatePicker, Form, InputNumber, Radio, Skeleton } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  // const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ form ] = Form.useForm();
  const initialDates =
    searchParams.get("checkIn") && searchParams.get("checkOut")
      ? [dayjs(searchParams.get("checkIn")), dayjs(searchParams.get("checkOut"))]
      : null;
  const roomsAvailable = Number(searchParams.get("roomMax"));
  const bedsAvailable = Number(searchParams.get("bedMax"));
  const [ editMode, setEditMode ] = useState( { dates: false, type: false } );
  const [ loading, setLoading ] = useState<boolean>( true );
  
  useEffect( () =>
  {
    const timer = setTimeout( () =>
    {
      setLoading( false );
    }, 2000 );
  
    return () => clearTimeout( timer );
  }, [] );

  const handleCancel = (field: "dates" | "type") => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    form.resetFields();
  };

  const handleSubmit = async (
    values: {
      RangePicker?: [ dayjs.Dayjs, dayjs.Dayjs ];
      selection?: string;
      beds?: number;
      rooms?: number;
    } = {}
  ) =>
  {
    setEditMode( { dates: false, type: false } );
    // console.log( values, params, searchParams.toString(), reservationData );

    if ( editMode?.type )
    {
      const { selection, beds, rooms } = values;
      const typeData: Record<string, string | number> = { selection };
      if ( selection === 'beds' && beds ) typeData.beds = beds;
      if ( selection === 'rooms' && rooms ) typeData.rooms = rooms;

      console.log( typeData );
      await updateSearchParams( typeData, searchParams, router );
    }

    if ( editMode?.dates )
    {
      const { RangePicker: [ checkIn, checkOut ] } = values;
      const reservationData = {
        checkIn: checkIn.format( 'YYYY-MM-DD' ),
        checkOut: checkOut.format( 'YYYY-MM-DD' ),
      };

      await updateSearchParams(
        {
          checkIn: reservationData.checkIn,
          checkOut: reservationData.checkOut,
        },
        searchParams,
        router
      );
    }
    // setTimeout( () =>
    // {
    //   window.location.reload();
    // }, 500 );
  };

  if (loading) {
    return (
      <div className='flex w-full items-center justify-center p-3 h-fit'>
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  };

  return (
    <Form
      onFinish={handleSubmit}
      {...formItemLayout}
      form={form}
      className="bg-cyan-600 text-white shadow-md"
      layout="vertical"
      style={{ maxWidth: 600, margin: "0 auto", padding: "20px", borderRadius: "8px" }}
      initialValues={{
        RangePicker: initialDates,
        selection: searchParams.get( "selection" ),
        beds: Number( searchParams.get( "beds" ) ),
        rooms: Number( searchParams.get( "rooms" ) ),
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
        className="flex justify-between items-center mb-4 text-white"
      >
        {editMode.dates ? (
          <>
            <Form.Item
              style={{
                color: "wheat"
              }}
              label={languageData.dates}
              name="RangePicker"
              rules={[ { required: true, message: languageData?.errors?.required } ]}
            >
              <RangePicker
                disabledDate={( current ) => current && current < dayjs().endOf( "day" )}
              />
            </Form.Item>
            <div className="flex gap-2">
              <button type="submit" className="px-2 py-1 bg-green-600 text-white font-semibold rounded-md">
                {languageData?.buttons?.save}
              </button>
              <button
                className="bg-slate-400 text-black px-2 py-1 rounded-md"
                onClick={() => handleCancel( "dates" )}
              >
                {languageData?.buttons?.cancel}
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center w-full">
            <span>
              {initialDates
                ? `${languageData?.date} : ${ initialDates[ 0 ]?.format( "YYYY-MM-DD" ) } ${languageData?.from} ${ initialDates[ 1 ]?.format( "YYYY-MM-DD" ) } ${languageData?.to}`
                : languageData?.noDate}
            </span>
            <motion.button
              className="px-2 py-1 bg-orange-500 text-white font-semibold rounded-md"
              onClick={() => setEditMode( ( prev ) => ( { ...prev, dates: true } ) )}
              whileTap={{ scale: 0.95 }}
            >
             {languageData?.buttons?.edit}
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
              rules={[ { required: true, message: "Please select an option!" } ]}
            >
              <Radio.Group>
                <Radio value="beds">{languageData?.beds}</Radio>
                <Radio value="rooms">{languageData?.rooms}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={( prev, curr ) => prev.selection !== curr.selection}
            >
              {( { getFieldValue } ) =>
              {
                const selection = getFieldValue( "selection" );
                if ( selection === "beds" )
                {
                  return (
                    <Form.Item
                      name="beds"
                      label={languageData?.beds}
                      rules={[
                        { required: true, message: languageData?.errors?.required },
                        { type: "number", min: 1, message: languageData?.errors?.noStock },
                        {
                          validator: ( _, value ) =>
                            value <= bedsAvailable ? Promise.resolve() : Promise.reject( "Not enough stock available" ),
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                  );
                }
                if ( selection === "rooms" )
                {
                  return (
                    <Form.Item
                      name="rooms"
                      label={languageData?.rooms}
                      rules={[
                        { required: true, message: languageData?.errors?.required },
                        { type: "number", min: 1, message: languageData?.errors?.noStock },
                        {
                          validator: ( _, value ) =>
                            value <= roomsAvailable ? Promise.resolve() : Promise.reject( "Not enough stock available" ),
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
                {languageData?.buttons?.save}
              </button>
              <button
                className="bg-slate-400 text-black px-2 py-1 rounded-md"
                onClick={() => handleCancel( "type" )}
              >
                {languageData?.buttons?.cancel}
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center w-full">
            <span>
              {form.getFieldValue( "selection" ) === "beds" ||
                ( !form.getFieldValue( "selection" ) && searchParams.get( "selection" ) === "beds" )
                ? `${languageData?.rent} : ${ form.getFieldValue( "beds" ) || searchParams.get( "beds" ) } ${languageData?.bedsSelected}`
                : `${languageData?.rent} : ${ form.getFieldValue( "rooms" ) || searchParams.get( "rooms" ) } ${languageData?.roomsSelected}`}
            </span>

            <motion.button
              className="px-2 py-1 bg-orange-500 text-white font-semibold rounded-md"
              onClick={() => setEditMode( ( prev ) => ( { ...prev, type: true } ) )}
              whileTap={{ scale: 0.95 }}
            >
              {languageData?.buttons?.edit}
            </motion.button>
          </div>
        )}
      </motion.div>
    </Form>
  );
}