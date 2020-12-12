require 'rails_helper'

RSpec.describe Relationship, type: :model do
  let(:relationship) { build(:relationship) }

  it 'return true' do
    expect(relationship.valid?).to eq true
  end

  describe 'user_id' do
    context 'when empty' do
      before { relationship.user_id = '' }

      it 'return false' do
        expect(relationship.valid?).to eq false
      end
    end

    context 'when user does not exist' do
      before { relationship.user_id += 2 }

      it 'return false' do
        expect(relationship.valid?).to eq false
      end
    end

    context 'when duplicate combination of user_id and follow_id' do
      before do
        @relationship = create(:relationship)
        relationship.user_id = @relationship.user_id
        relationship.follow_id = @relationship.follow_id
      end

      it 'return false' do
        expect(relationship.valid?).to eq false
      end
    end
  end

  describe 'follow_id' do
    context 'when empty' do
      before { relationship.follow_id = '' }

      it 'return false' do
        expect(relationship.valid?).to eq false
      end
    end

    context 'when user does not exist' do
      before { relationship.follow_id += 1 }

      it 'return false' do
        expect(relationship.valid?).to eq false
      end
    end
  end
end
