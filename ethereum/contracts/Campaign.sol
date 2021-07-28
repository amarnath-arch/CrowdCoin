pragma solidity ^0.4.17;


contract CampaignFactory{
    address[] public deployedContracts;
    
    function createCampaign(uint minContribution) public{
        address deployedContract=new Campaign(minContribution,msg.sender);
        deployedContracts.push(deployedContract);
    }
    
    function getDeployedContracts()public view returns(address[]){
        return deployedContracts;
    }
}


contract Campaign{
    struct Request{
        string description;
        uint value;
        address recepient;
        bool complete;
        uint approvalsCount;
        mapping(address=>bool) approvals;
        
    }
    

    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address=>bool) public approvers;
    uint public approversCount;
    
    
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    
    function Campaign(uint minContribution,address creator) public{
        manager=creator;
        minimumContribution=minContribution;
    }
    
    function contribute()public payable{
        require(msg.value>minimumContribution);
        approvers[msg.sender]=true;
        approversCount++;
    }
    
    function createRequest(string description,uint value,address recepient) public{
        Request memory newRequest=Request({
            description:description,
            value:value,
            recepient:recepient,
            complete:false,
            approvalsCount:0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public{
        Request storage request=requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvalsCount++;
        request.approvals[msg.sender]=true;
    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request=requests[index];
        require(!request.complete);
        require(request.approvalsCount > (approversCount)/2);
        
        request.recepient.transfer(request.value);
        request.complete=true;
        
        
    }


    function getSummary() public view returns(
        uint,uint,uint,uint, address
    ){
        return(
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager

        );
    }

    function getRequestCount() public view returns(uint ){
        return requests.length;
    }
    
}