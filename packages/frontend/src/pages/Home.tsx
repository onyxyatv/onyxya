import Header from "@/components/header/header";
import MyMovies from "@/components/home/myMovies";
import MyMusic from "@/components/home/myMusic";

const Home = () => {
  return (
    <div>
      <Header />
      <div>
        <h2 className="text-2xl">Movies</h2>
        <MyMovies/>
      </div>

      <div>
        <h2>Music</h2>
        <MyMusic/>
      </div>

      <h2>Series</h2>
    </div>
  );
};

export default Home;