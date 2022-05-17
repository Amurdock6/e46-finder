

const Listing = (props) => {
    const { link, car, price, picture } = props;
    return (
        <div className='listing-contanier'>
            {/* <Link to={listing.link}> */}
                <p> {link}</p>
                <p>{car}</p>
                {/* <p>{price}</p>
                <img src={picture} alt="listing"></img> */}
            {/* </Link> */}
        </div>
    )
};

export default Listing;
