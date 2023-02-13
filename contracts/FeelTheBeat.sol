pragma solidity ^0.8.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/utils/Counters.sol";

contract FeelTheBeat is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("FeelTheBeat", "BEAT") {}

    mapping (uint256 => string) private _tokenURIs;

    function tokenURI(uint256 _tokenId) public view virtual override
        returns (string memory)
    {
        return _tokenURIs[_tokenId];
    }

    function createBeat(string memory tokenURI_) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _tokenURIs[newItemId] = tokenURI_;
        //_setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function tokensOfOwner(address _owner) external view returns(uint256[] memory ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalTokens = _tokenIds.current();
            uint256 resultIndex = 0;


            uint256 tokenId;

            for (tokenId = 1; tokenId <= totalTokens; tokenId++) {
                if (ownerOf(tokenId) == _owner) {
                    result[resultIndex] = tokenId;
                    resultIndex++;
                }
            }

            return result;
        }
    }
}
