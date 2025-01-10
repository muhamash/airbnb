'use client'

import { DatePicker, Form, InputNumber, Radio } from 'antd';
import dayjs from 'dayjs';
import { motion } from "framer-motion";
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
    userId: string;
    hotelName: string;
    hotelAddress: string;
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

export default function Reserve({ rate, perNight, langData, hotelAddress, hotelName }: ReserveFormProps) {
    const searchParams = useSearchParams();
    const params = useParams();
    const [form] = Form.useForm();
    const roomsAvailable = Number(searchParams.get("roomMax"));
    const bedsAvailable = Number(searchParams.get("bedMax"));
    const [selection, setSelection] = useState<string>('beds');
    const router = useRouter();

    const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelection(e.target.value);
        form.resetFields(['beds', 'rooms']);
    };

    const handleSubmit = async (values: { RangePicker: [dayjs.Dayjs, dayjs.Dayjs], beds?: number, rooms?: number}) => {
        const { RangePicker: [checkIn, checkOut] } = values;

        const reservationData = {
            checkIn: checkIn.format('YYYY-MM-DD'),
            checkOut: checkOut.format('YYYY-MM-DD'),
            selection,
            ...(selection === 'beds' ? { beds: values.beds } : { rooms: values.rooms }),
        };

        if (
            (reservationData?.rooms && (reservationData?.rooms <= 0 || reservationData?.rooms > roomsAvailable)) ||
            (reservationData?.beds && (reservationData?.beds <= 0 || reservationData?.beds > bedsAvailable))
        ) {
            form.setFields([
                { name: 'beds', errors: [langData.errors.notStock] },
                { name: 'rooms', errors: [langData.errors.notStock] }
            ]);
            return;
        }
        // console.log("Reservation Data:", reservationData);
        
        const parseSearchParams = {
            checkIn: reservationData?.checkIn || null,
            checkOut: reservationData?.checkOut || null,
            selection,
            ...(reservationData?.selection === 'beds' ? { beds: values.beds } : { rooms: values.rooms }),
            rate: JSON.stringify({
                beds: rate?.bed,
                rooms: rate?.room
            }),
            roomMax: searchParams.get("roomMax"),
            bedMax: searchParams.get("bedMax"),
            ratings: searchParams.get("ratings"),
            ratingsLength: searchParams.get( "ratingsLength" ),
            hotelAddress: hotelAddress,
            hotelName: hotelName,
        };

        const queryString = new URLSearchParams(parseSearchParams).toString();

        router.push(`http://localhost:3000/${params?.lang}/details/${params?.id}/payment?${queryString}`);
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
                className="bg-black/10 backdrop-blur-md shadow-md shadow-sky-600 rounded-xl p-5 border relative overflow-hidden"
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex md:flex-row flex-col flex-wrap gap-2 justify-between items-center mb-4"
                >
                    <div>
                        <div className='flex flex-row-reverse justify-between items-center mb-2'>
                            <div className="flex items-center">
                                <i className="fas fa-star text-yellow-500 mr-1"></i>
                                <span>{searchParams.get("ratings")}</span>
                            </div>
                            <span className="text-gray-600 ml-1">{perNight}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 rounded-md">
                            <div className="rounded-md shadow-purple-500 m-[1px] border-[1px] border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                                <p className="text-md text-slate-100 font-bold text-center py-1 px-3">{langData?.bed}</p>
                            </div>
                            <div className="rounded-md m-[1px] border-[1px] border-gradient-to-r shadow-teal-500 from-teal-500 to-cyan-500 bg-gradient-to-r from-teal-50 to-cyan-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                                <p className="text-md text-slate-100 font-bold text-center p-1">{langData?.room}</p>
                            </div>
                            <div className="rounded-md m-[1px] border-[1px] border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                                <p className="text-md text-slate-100 font-bold text-center p-1">{rate?.bed} ৳</p>
                            </div>
                            <div className="rounded-md m-[1px] border-[1px] border-gradient-to-r from-teal-500 to-cyan-500 bg-gradient-to-r from-teal-50 to-cyan-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                                <p className="text-md text-slate-100 font-bold text-center p-1">{rate?.room} ৳</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Image
                            alt='image?'
                            width={170}
                            height={170}
                            src={'/ttt.png'}
                            layout
                            className='object-fit'
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
                        label={langData?.dates}
                        name="RangePicker"
                        rules={[{ required: true, message: langData?.errors?.required }]}
                    >
                        <RangePicker
                            disabledDate={(current) => current && current < dayjs().endOf('day')}
                        />
                    </Form.Item>

                    <Form.Item
                        label={langData?.selection}
                        name="selection"
                        rules={[{ required: true, message: langData?.errors?.required }]}
                    >
                        <Radio.Group onChange={handleSelectionChange}>
                            <Radio value="beds">{langData?.bed}</Radio>
                            <Radio value="rooms">{langData?.room}</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {selection === 'beds' && (
                        <Form.Item
                            label={langData?.bed}
                            name="beds"
                            rules={[
                                { required: true, message: langData?.errors?.required },
                                {
                                    validator: (_, value) => {
                                        if (value === 0 || (value && value > bedsAvailable)) {
                                            return Promise.reject(langData?.errors?.notStock);
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <InputNumber />
                        </Form.Item>
                    )}

                    {selection === 'rooms' && (
                        <Form.Item
                            label={langData?.room}
                            name="rooms"
                            rules={[
                                { required: true, message: langData?.errors?.required },
                                {
                                    validator: (_, value) => {
                                        if (value === 0 || (value && value > roomsAvailable)) {
                                            return Promise.reject(langData?.errors?.notStock);
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <InputNumber />
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