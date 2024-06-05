import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ChevronRight } from "lucide-react"

const MyMovies = () => {
  const movies: any = [
    {
      "name": "Leon",
      "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShFtS6FVfEx_Oym0ZZ0WEPD1CYAKSIDF_9KA&s"
    },
    {
      "name": "Mad Max",
      "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsFz5P4DqKsPT1gkeP7CmHJtkEWs6ScqOgRA&s"
    },
    {
      "name": "Star wars",
      "img": "https://lumiere-a.akamaihd.net/v1/images/image_83011738.jpeg?region=0,0,540,810"
    },
  ];

  return (
    <section className="overflow-x-auto flex flex-row space-x-6 p-2">
      {
        movies.map((movie: { name: string, img: string }) => {
          return (
            <Card className="border-2 border-slate-700 border-solid">
              <CardHeader>
                <CardTitle>{movie.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img className="w-36 h-48" src={movie.img} alt={`${movie.name} Image`} />
              </CardContent>
              <CardFooter>
                <p>Added at 01/06/2024</p>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4 to-black" />
                </Button>
              </CardFooter>
            </Card>
          );
        })
      }
    </section>
  );
}

export default MyMovies;