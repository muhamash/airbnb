'use client';

import { DatePicker, Form, InputNumber, Radio } from 'antd';
import dayjs from 'dayjs';
import { motion } from "framer-motion"; // Import Framer Motion
import Image from 'next/image';
import { useParams, useSearchParams } from "next/navigation";
import { useState } from 'react';

interface ReserveFormProps {
    rate: {
        bed: number;
        room: number;
    };
    perNight: string;
    langData: {
        checkIn: string;
        checkOut: string;
        bedrooms: string;
        beds: string;
        guest: string;
        reserve: string;
        text: string;
        errors: {
            notStock: string;
            guest: string;
            beds: string;
            bedrooms: string;
            checkOut: string;
            required: string;
            pastDate: string;
        };
    };
    stocks: {
        hotelId: string;
        personMax: number;
        roomMax: number;
        bedMax: number;
        available: boolean;
    };
    userId: string;
}

const { RangePicker } = DatePicker;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

export default function Reserve({ rate, perNight, langData }: ReserveFormProps) {
    const searchParams = useSearchParams();
    const params = useParams();
    const [form] = Form.useForm();

    const roomsAvailable = Number(searchParams.get("roomMax")) || 0;
    const bedsAvailable = Number(searchParams.get("bedMax")) || 0;

    const [selection, setSelection] = useState<string>('beds');

    const handleSelectionChange = (e: any) => {
        setSelection(e.target.value);
        form.resetFields(['beds', 'rooms']);
    };

    const handleSubmit = (values: any) => {
        const { RangePicker: [checkIn, checkOut] } = values;

        const reservationData = {
            checkIn: checkIn.format('YYYY-MM-DD'),
            checkOut: checkOut.format('YYYY-MM-DD'),
            selection,
            ...(selection === 'beds' ? { beds: values.beds } : { rooms: values.rooms }),
        };

        console.log("Reservation Data:", reservationData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            <Form
                onFinish={handleSubmit}
                {...formItemLayout}
                form={form}
                style={{ maxWidth: 600 }}
                initialValues={{ selection: "beds" }}
                className="bg-white shadow-lg rounded-xl p-6 border relative overflow-hidden"
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex md:flex-row flex-col flex-wrap gap-1 justify-between items-center mb-4"
                >
                    <div>
                        <div className='flex flex-row-reverse justify-between items-center mb-2'>
                            <div className="flex items-center">
                                <i className="fas fa-star text-yellow-500 mr-1"></i>
                                <span>{searchParams.get( "ratings" )}</span>
                            </div>
                            <span className="text-gray-600 ml-1">{perNight}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 rounded-md">
                            {/* Cell 1 */}
                            <div className="rounded-md shadow-purple-500 m-[1px] border-[1px] border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                                <p className="text-md text-slate-100 font-bold text-center py-1 px-3">Beds</p>
                            </div>

                            {/* Cell 2 */}
                            <div className="rounded-md m-[1px] border-[1px] border-gradient-to-r shadow-teal-500 from-teal-500 to-cyan-500 bg-gradient-to-r from-teal-50 to-cyan-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                                <p className="text-md text-slate-100 font-bold text-center p-1">Rooms</p>
                            </div>

                            {/* Cell 3 */}
                            <div className="rounded-md m-[1px] border-[1px] border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                                <p className="text-md text-slate-100 font-bold text-center p-1">{rate?.bed } tk</p>
                            </div>

                            {/* Cell 4 */}
                            <div className="rounded-md m-[1px] border-[1px] border-gradient-to-r from-teal-500 to-cyan-500 bg-gradient-to-r from-teal-50 to-cyan-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                                <p className="text-md text-slate-100 font-bold text-center p-1">{ rate?.room } tk</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Image
                            alt='image?'
                            width={170}
                            height={200}
                            src={'/reg.jpeg'}
                        />
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="rounded-lg mb-4 w-full"
                >
                    <Form.Item
                        label="Trip dates"
                        name="RangePicker"
                        rules={[ { required: true, message: 'Please select your trip dates!' } ]}
                    >
                        <RangePicker
                            disabledDate={( current ) => current && current < dayjs().endOf( 'day' )}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Selection"
                        name="selection"
                        rules={[ { required: true, message: 'Please select beds or rooms!' } ]}
                    >
                        <Radio.Group onChange={handleSelectionChange}>
                            <Radio value="beds">Beds</Radio>
                            <Radio value="rooms">Rooms</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {selection === 'beds' && (
                        <Form.Item
                            label="Beds"
                            name="beds"
                            rules={[
                                { required: true, message: 'Please enter the number of beds!' },
                            ]}
                        >
                            <InputNumber min={1} max={bedsAvailable} />
                        </Form.Item>
                    )}

                    {selection === 'rooms' && (
                        <Form.Item
                            label="Rooms"
                            name="rooms"
                            rules={[
                                { required: true, message: 'Please enter the number of rooms!' },
                            ]}
                        >
                            <InputNumber min={1} max={roomsAvailable} />
                        </Form.Item>
                    )}
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full block text-center bg-cyan-700 text-white py-3 rounded-lg transition-all hover:brightness-90"
                >
                    {langData?.reserve}
                </motion.button>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-center mt-4 text-gray-600"
                >
                    <p className='text-orange-600'>{langData?.text}</p>
                </motion.div>
            </Form>
        </motion.div>
    );
}