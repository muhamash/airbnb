'use client'

import { useFormContext } from '@/utils/FormContext';
import { motion } from 'framer-motion';


export const EditField = ( { field }: { field: string } ) =>
{
  const { state, dispatch } = useFormContext();

  return (
    <div className="flex gap-2">
      <motion.input
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        value={state[field as keyof FormState]}
        onChange={(e) => dispatch({
          type: 'UPDATE_FIELD',
          field,
          value: e.target.value
        })}
        className="border px-2 py-1 rounded"
        placeholder={field.replace(/([A-Z])/g, ' $1')}
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => dispatch({ type: 'TOGGLE_EDIT', field })}
        className="mt-2 text-blue-500"
      >
        <i className="fas fa-save mr-2"></i>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => dispatch({ type: 'RESET_FIELD', field })}
        className="mt-2 text-red-500"
      >
        <i className="fas fa-times mr-2"></i>
        Cancel
      </motion.button>
    </div>
  );
};