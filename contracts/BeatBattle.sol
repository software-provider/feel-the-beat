pragma solidity ^0.8.0;

contract BeatBattle {

    struct Battle {
        uint id;
        uint startTime;
        uint endTime;
        string metadataUri;

        uint reward;
        bool distributedReward;
        
        uint[] beatIds; // list of registered beats with beatId = tokenId
        mapping (uint => VotingBeat) votingBeats; // voting result beatId => vote
    }

    struct VotingBeat {
        address author;
        uint count;
        address[] voterAddresses;
    }

    uint public battleCount;
    mapping (uint => Battle) public battles;

    function getBattle(uint _battleId) public view returns (uint, uint, uint, string memory, uint[] memory, uint) {
        return (battles[_battleId].id, 
                battles[_battleId].startTime, 
                battles[_battleId].endTime,
                battles[_battleId].metadataUri,
                battles[_battleId].beatIds,
                battles[_battleId].reward);
    }

    function getBattleCount() public view returns (uint) {
        return battleCount;
    }

    function getVotingBeatInfo(uint _battleId, uint _beatId) public view returns (
        uint count,
        address[] memory voterAddresses
    ) 
    {
        count = battles[_battleId].votingBeats[_beatId].count;
        voterAddresses = battles[_battleId].votingBeats[_beatId].voterAddresses;
    }


    function createBattle(uint _startTime, uint _endTime, string memory _metadataUri) public payable  {
        // // validate time
        // require(_endTime > _startTime && _endTime >= block.timestamp,"Invalid time");

        // Create battle
        battleCount = battleCount + 1;
        battles[battleCount].id = battleCount;
        battles[battleCount].startTime = _startTime;
        battles[battleCount].endTime = _endTime;
        battles[battleCount].metadataUri = _metadataUri;
        battles[battleCount].reward = msg.value;
    }

    function vote(uint _battleId, uint _beatId) public {
        // // TODO: validate time
        // require (block.timestamp >= battles[_battleId].startTime && block.timestamp <= battles[_battleId].endTime, "Invalid time");

        // validate voting
        uint voterCount = battles[_battleId].votingBeats[_beatId].voterAddresses.length;
        bool isVoted = false;
        for (uint voterIdx = 0; voterIdx < voterCount; voterIdx++) {
            if (battles[_battleId].votingBeats[_beatId].voterAddresses[voterIdx] == msg.sender) {
                isVoted = true;
            }
        }
        require(!isVoted, "Already voted");

        battles[_battleId].votingBeats[_beatId].count += 1;
        battles[_battleId].votingBeats[_beatId].voterAddresses.push(msg.sender);
    }

    function join(uint _battleId, uint _beatId) public {
        // // validate time
        // require (block.timestamp >= battles[_battleId].startTime && block.timestamp <= battles[_battleId].endTime, "Invalid time");

        // validate existing registered beat
        bool existedBeatId = false;
        for (uint i = 0; i < battles[_battleId].beatIds.length; i++) {
            if (battles[_battleId].beatIds[i] == _beatId) {
                existedBeatId = true;
            }
        }
        require(!existedBeatId, "Already joined");
  
        // adding a beat to battle
        battles[_battleId].beatIds.push(_beatId);
        battles[_battleId].votingBeats[_beatId].count = 0;
        battles[_battleId].votingBeats[_beatId].author = msg.sender;
    }

    function claimReward(uint _battleId) public payable {
        // // validate time
        // require (block.timestamp > battles[_battleId].endTime, "The battle has not ended");

        // validate winner
        uint winningBeatId = getWinningBeat(_battleId);
        require(winningBeatId > 0 && _battleId > 0 && battles[_battleId].votingBeats[winningBeatId].author == msg.sender, "Invalid winner");

        // check distributed or not
        require(!battles[_battleId].distributedReward, "Already distributed reward");

        // TODO: multiple winners

        // distribute reward
        payable(msg.sender).transfer(battles[_battleId].reward);
        battles[_battleId].distributedReward = true;
    }

    function getWinningBeat(uint _battleId) public view returns (uint) {
        // // validate time
        // require (block.timestamp > battles[_battleId].endTime,  "The battle has not ended");

        uint winningBeatId = 0;
        uint winningVoteCount = 0;
        for (uint i = 0; i < battles[_battleId].beatIds.length; i++) {
            uint beatId = battles[_battleId].beatIds[i];
            uint votingCount = battles[_battleId].votingBeats[beatId].count;
            if (votingCount > winningVoteCount) {
                winningVoteCount = votingCount;
                winningBeatId = beatId;
            }
        }
        return winningBeatId;
    }
}