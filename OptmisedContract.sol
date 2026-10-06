// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.8.0;
contract OptimisedContract{
    // Producer list [address and name].
    mapping(address => string) public producers;
    
    // Products details.
    uint public totalProduct = 0;
    struct Product{
        uint id;
        uint price;
        uint quantity;
        string product_name;
        address producer_address;
    }
    mapping(uint => Product) public products;
    
    // Order details
    uint public totalOrder = 0;
    struct Order{
        uint id;
        uint product_id;
        uint quantity;
        string customer_name;
        string status;
        string delivery_address;
        address customer_address;
    }
    mapping(uint => Order) public orders;
    
    // Register producer authentication.
    modifier registerProducerAuth() {
        require(bytes(producers[msg.sender]).length == 0, "Producer already registered.");
        _;
    }
    
    // Add product authentication.
    modifier addProductAuth() {
        require(bytes(producers[msg.sender]).length > 0, "Producer not registered.");
        _;
    }
    
    // Seller Functions
    
    function isRegistered(address _addr) view external returns (bool) {
        return bytes(producers[_addr]).length > 0;
    }
    
    function registerProducer(string memory _name) external registerProducerAuth {
        producers[msg.sender] = _name;
    }
    
    function addProduct(string memory _pname, uint _price, uint _quantity) external addProductAuth {
        totalProduct += 1;
        products[totalProduct] = Product(totalProduct, _price, _quantity, _pname, msg.sender);
    }
    
    function getTotalProductByProducer(address _addr) view external returns (uint) {
        uint counter = 0;
        for (uint i = 1; i <= totalProduct; i++) {
            if (products[i].producer_address == _addr) {
                counter++;
            }
        }
        return counter;
    }
    
    function getProductDetails(uint _pid) view external returns (uint, uint, uint, string memory) {
        require(_pid <= totalProduct, "Invalid product ID.");
        Product memory p = products[_pid];
        return (p.id, p.price, p.quantity, p.product_name);
    }
    
    function updatePrice(uint _pid, uint _newPrice) external {
        require(products[_pid].producer_address == msg.sender, "Not the product owner.");
        products[_pid].price = _newPrice;
    }
    
    function getMyTotalOrders(address _addr) view external returns (uint) {
        uint counter = 0;
        for (uint i = 1; i <= totalOrder; i++) {
            if (orders[i].customer_address == _addr) {
                counter++;
            }
        }
        return counter;
    }
    
    function updateOrderStatus(uint _oid, string memory _status) external {
        require(orders[_oid].product_id > 0, "Order not found.");
        uint productId = orders[_oid].product_id;
        require(products[productId].producer_address == msg.sender, "Not the product owner.");
        
        if (keccak256(abi.encodePacked(_status)) == keccak256("Rejected")) {
            products[productId].quantity += orders[_oid].quantity;
            orders[_oid].status = _status;
        } else if (keccak256(abi.encodePacked(orders[_oid].status)) != keccak256("Rejected") && keccak256(abi.encodePacked(_status)) == keccak256("Delivered")) {
            orders[_oid].status = _status;
        }
    }
    
    // Customer Functions
    
    function placeOrder(string memory _cname, string memory _daddress, uint _pid, uint _quantity) external {
        require(products[_pid].quantity >= _quantity, "Insufficient quantity.");
        
        totalOrder += 1;
        orders[totalOrder] = Order(totalOrder, _pid, _quantity, _cname, "Placed", _daddress, msg.sender);
        products[_pid].quantity -= _quantity;
    }
    
    function getTotalOrder(address _addr) view external returns (uint) {
        uint counter = 0;
        for (uint i = 1; i <= totalOrder; i++) {
            if (orders[i].customer_address == _addr) {
                counter++;
            }
        }
        return counter;
    }
    
    function fetchNextOrderById(address _addr, uint _oid) view external returns (uint, uint, uint, string memory, string memory, string memory, bool) {
        require(_oid <= totalOrder, "Invalid order ID.");
        if (_addr == orders[_oid].customer_address) {
            return (orders[_oid].id, orders[_oid].product_id, orders[_oid].quantity, orders[_oid].customer_name, orders[_oid].status, orders[_oid].delivery_address, true);
        }
        return (0, 0, 0, "", "", "", false);
    }
}