require 'rails_helper'

RSpec.describe 'Api::V1::Likes', type: :request do
  let(:user) { create(:user) }
  let(:record) { create(:record) }
  let(:token) { sign_in({ email: user.email, password: 'password' }) }
  let(:valid_data) do
    {
      **token,
      id: record.id
    }
  end

  describe 'POST /api/v1/likes' do
    context 'when data is valid' do
      it 'like' do
        expect { like(valid_data) }.to change(Like, :count).by(1)
        expect(response.status).to eq 204
      end
    end

    context 'when data is invalid' do
      context 'when token is invalid' do
        let(:invalid_data) do
          {
            id: record.id
          }
        end

        it 'raise NoMethodError' do
          expect { like(invalid_data) }.to raise_error(NoMethodError)
        end
      end

      context 'when record does not exist' do
        let(:invalid_data) do
          {
            **token,
            id: record.id += 1
          }
        end

        it 'raise ActiveRecord::RecordNotFound' do
          expect { like(invalid_data) }.to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end
  end

  describe 'DELETE /api/v1/likes/:id' do
    context 'when liking' do
      before { like(valid_data) }

      it 'unlike' do
        expect { unlike(record.id, token) }.to change(Like, :count).by(-1)
        expect(response.status).to eq 204
      end
    end

    context 'when not liking' do
      it 'not unlike' do
        expect { unlike(record.id, token) }.to change(Like, :count).by(0)
        expect(response.status).to eq 204
      end
    end
  end
end
