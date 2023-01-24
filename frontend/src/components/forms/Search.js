import axios from "axios";
import { useSearch } from "../../context/search";
import { useNavigate } from "react-router-dom";

const Search = () => {

    const { setProducts, keyword, setKeyword, setTotal } = useSearch();
    const navigate = useNavigate();

    const handleSubmit = async (e)=> {
        e.preventDefault();
        try {
            const {data} = await axios.get('/products/search/'+keyword+'/'+1);
            setProducts(data.results);
            setTotal(data.total);
            navigate('/search');
        }catch (e) {
            console.log(e)
        }
    }
    return (
        <form className="d-flex" onSubmit={handleSubmit}>
            <input
                type="search"
                style={{ borderRadius: "0px" }}
                className="form-control"
                placeholder="Search"
                name='search'
                onChange={(e) => {
                     setKeyword(e.target.value);
                 }}
                value={keyword}
            />
            <button
                className="btn btn-outline-primary"
                type="submit"
                style={{ borderRadius: "0px" }}
            >
                Search
            </button>
        </form>
    );
}

export default Search;