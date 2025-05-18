import React, { useState } from 'react';
import { CreateKudoCardRequestDto } from '../../application/dtos/CreateKudoCardRequestDto';
import { useKudosCardList } from '../hooks/useKudosCardList';
import { useAuth } from '../../../../contexts/AuthContext';
import { DEPARTMENT_TEAMS } from '../../domain/constants/teamConstants';
import { RECOGNITION_CATEGORIES } from '../../domain/constants/categoryConstants';

interface KudoCardFormProps {
  onSuccess?: () => void;
  className?: string;
}

const KudoCardForm: React.FC<KudoCardFormProps> = ({ onSuccess, className = '' }) => {
  const { user } = useAuth();
  const giverId = user?.id || '';

  const { createKudoCard, isCreating, createError, createSuccess } = useKudosCardList(giverId);

  const [formData, setFormData] = useState({
    recipientName: '',
    teamId: '',
    categoryId: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the team and category names based on selected IDs
    const selectedTeam = DEPARTMENT_TEAMS.find((team) => team.id === formData.teamId);
    const selectedCategory = RECOGNITION_CATEGORIES.find((category) => category.id === formData.categoryId);

    // Create DTO from form data
    const requestDto = new CreateKudoCardRequestDto({
      ...formData,
      teamName: selectedTeam?.name,
      categoryName: selectedCategory?.name,
    });

    // Call create function
    const result = await createKudoCard(requestDto);

    // If successful, reset form and call onSuccess callback
    if (result && result.success) {
      setFormData({
        recipientName: '',
        teamId: '',
        categoryId: '',
        message: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <div className={`p-6 bg-white rounded-lg shadow ${className}`}>
      <h2 className='text-xl font-bold mb-4'>Create Kudo Card</h2>

      {createError && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{createError}</div>}

      {createSuccess && (
        <div className='mb-4 p-3 bg-green-100 text-green-700 rounded'>Kudo card created successfully!</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='recipientName' className='block text-sm font-medium text-gray-700 mb-1'>
            Recipient Name
          </label>
          <input
            type='text'
            id='recipientName'
            name='recipientName'
            className='w-full p-2 border border-gray-300 rounded text-indigo-700 placeholder-indigo-300'
            value={formData.recipientName}
            onChange={handleChange}
            required
            placeholder="Enter recipient's name"
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='teamId' className='block text-sm font-medium text-gray-700 mb-1'>
            Team
          </label>
          <select
            id='teamId'
            name='teamId'
            className='w-full p-2 border border-gray-300 rounded text-indigo-700'
            value={formData.teamId}
            onChange={handleChange}
            required
          >
            <option value=''>Select a team</option>
            {DEPARTMENT_TEAMS.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-4'>
          <label htmlFor='categoryId' className='block text-sm font-medium text-gray-700 mb-1'>
            Category
          </label>
          <select
            id='categoryId'
            name='categoryId'
            className='w-full p-2 border border-gray-300 rounded text-indigo-700'
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value=''>Select a category</option>
            {RECOGNITION_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-4'>
          <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
            Message
          </label>
          <textarea
            id='message'
            name='message'
            rows={4}
            className='w-full p-2 border border-gray-300 rounded text-indigo-700 placeholder-indigo-300'
            value={formData.message}
            onChange={handleChange}
            required
            placeholder='Write your kudo message here...'
          />
        </div>

        <button
          type='submit'
          className='w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:bg-purple-300'
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Kudo Card'}
        </button>
      </form>
    </div>
  );
};

export default KudoCardForm;
