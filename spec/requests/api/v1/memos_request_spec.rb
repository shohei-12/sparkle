require 'rails_helper'

RSpec.describe 'Api::V1::Memos', type: :request do
  describe 'POST /api/v1/memos' do
    before { @record = create(:record) }

    context 'when data is valid' do
      let(:valid_data) do
        {
          appearance: 'memo',
          breakfast: 'memo',
          lunch: 'memo',
          dinner: 'memo',
          snack: 'memo',
          record_id: @record.id
        }
      end

      it 'save memo' do
        expect { save_memo(valid_data) }.to change(Memo, :count).by(1)
        expect(response.status).to eq 204
      end
    end

    context 'when data is invalid' do
      let(:invalid_data) do
        {
          appearance: 'memo',
          breakfast: 'memo',
          lunch: 'memo',
          dinner: 'memo',
          snack: 'memo',
          record_id: @record.id + 1
        }
      end

      it 'not save memo' do
        expect { save_memo(invalid_data) }.to change(Memo, :count).by(0)
        expect(response.status).to eq 204
      end
    end
  end
end
