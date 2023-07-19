module trace1::Trace1{
    use std::signer;
    use std::string::utf8;
    use std::string;
    use std::string::String;


    use aptos_framework::account;
    use std::vector; 




    struct Item_list has store,drop,key{
        items_id: vector<u64>,
        items_key:vector<u64>,
    }

    struct Cur_item has store,drop,key{
        item_id:u64,
        item_key:u64,
    }

     struct Count has store,drop,key{
        counts:u64,
    }
    
   
// code for item traceability
    public entry fun generate_item(creator: &signer)acquires Count,Item_list{

        if (!exists<Count>(signer::address_of(creator))) {
            move_to<Count>(creator, Count {
                
                counts: 1,

            });
        }

        else{
            let _count = borrow_global_mut<Count>(signer::address_of(creator)); 
            _count.counts = _count.counts + 1 ;
        };


        if (!exists<Item_list>(signer::address_of(creator))) {
            move_to<Item_list>(creator, Item_list {
                
                items_id: vector::empty<u64>(),
                items_key:vector::empty<u64>(),

            });

            let items = borrow_global_mut<Item_list>(signer::address_of(creator));
             let count_ = borrow_global<Count>(signer::address_of(creator));
            items.items_id = vector<u64>[ 1 ] ;
            items.items_key = vector<u64>[ 1 + 10 ] ;
        }
        else{

            let count_ = borrow_global<Count>(signer::address_of(creator));
            let items_ = borrow_global_mut<Item_list>(signer::address_of(creator));
            vector::push_back<u64>( &mut items_.items_id, count_.counts);
            vector::push_back<u64>( &mut items_.items_key, count_.counts + 10 );
            // items_.items_id = vector<u64>[ count_.counts ] ;
            // items_.items_key = vector<u64>[ count_.counts + 10 ] ;
        };

    }

    public entry fun display_item(creator: &signer, num: u64)acquires Cur_item,Item_list{

        if (!exists<Cur_item>(signer::address_of(creator))) {
            move_to<Cur_item>(creator, Cur_item {
                
                item_id: 0,
                item_key: 0,

            });
        };
        
        let list = borrow_global<Item_list>(signer::address_of(creator));
        let cur = borrow_global_mut<Cur_item>(signer::address_of(creator));

        let id : u64 = *vector::borrow<u64>( &list.items_id, num);
        let key : u64 = *vector::borrow<u64>( &list.items_key, num);

        cur.item_id = id;
        cur.item_key = key;

    }

}