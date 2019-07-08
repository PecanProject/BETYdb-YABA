from webtest import TestApp
import unittest

from server import app # the connexion Flask app object

class TestEndpoints(unittest.TestCase):
    # could also be set up globally outside of this class
    @classmethod
    def setUpClass(cls):
        cls.app = TestApp(app)

    def test_index_point(self):
        resp = self.app.get('http://www.0.0.0.0:5000/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn(b'Welcome to YABA API Index Route', resp)
    
    def test_insert_experiments(self):
        csv_filename='experiments.csv'
        csv_path='/home/saurabh/Desktop/PEcAn/YABA/input_files/'+csv_filename
        resp = self.app.post('http://www.0.0.0.0:5000/yaba/v1/experiments?username=guestuser',
            upload_files=[('fileName', csv_path)])
        self.assertEqual(resp.status_code, 201)
        self.assertIn(b'Successfully inserted', resp.body)

    def test_insert_sites(self):
        csv_filename='sites.csv'
        csv_path='/home/saurabh/Desktop/PEcAn/YABA/input_files/'+csv_filename

        shp_file='/home/saurabh/Desktop/PEcAn/YABA/input_files/S8_two_row_polys.shp'
        dbf_file='/home/saurabh/Desktop/PEcAn/YABA/input_files/S8_two_row_polys.dbf'
        prj_file='/home/saurabh/Desktop/PEcAn/YABA/input_files/S8_two_row_polys.prj'
        shx_file='/home/saurabh/Desktop/PEcAn/YABA/input_files/S8_two_row_polys.shx'

        resp = self.app.post('http://www.0.0.0.0:5000/yaba/v1/sites',
            upload_files=[('fileName', csv_path),('shp_file', shp_file),
            ('dbf_file', dbf_file),('prj_file', prj_file),('shx_file', shx_file)])
        self.assertEqual(resp.status_code, 201)
        self.assertIn(b'Successfully inserted', resp.body)

    def test_insert_treatments(self):
        csv_filename='treatments.csv'
        csv_path='/home/saurabh/Desktop/PEcAn/YABA/input_files/'+csv_filename
        resp = self.app.post('http://www.0.0.0.0:5000/yaba/v1/treatments?username=guestuser',
            upload_files=[('fileName', csv_path)])
        self.assertEqual(resp.status_code, 201)
        self.assertIn(b'Successfully inserted', resp.body)

    def test_insert_cultivars(self):
        csv_filename='cultivars.csv'
        csv_path='/home/saurabh/Desktop/PEcAn/YABA/input_files/'+csv_filename
        resp = self.app.post('http://www.0.0.0.0:5000/yaba/v1/cultivars',
            upload_files=[('fileName', csv_path)])
        self.assertEqual(resp.status_code, 201)
        self.assertIn(b'Successfully inserted', resp.body)

    def test_insert_citations(self):
        csv_filename='citations.csv'
        csv_path='/home/saurabh/Desktop/PEcAn/YABA/input_files/'+csv_filename
        resp = self.app.post('http://www.0.0.0.0:5000/yaba/v1/citations?username=guestuser',
            upload_files=[('fileName', csv_path)])
        self.assertEqual(resp.status_code, 201)
        self.assertIn(b'Successfully inserted', resp.body)
        
    def test_insert_experimentSites(self):
        csv_filename='experiments_sites.csv'
        csv_path='/home/saurabh/Desktop/PEcAn/YABA/input_files/'+csv_filename
        resp = self.app.post('http://www.0.0.0.0:5000/yaba/v1/experiments_sites',
            upload_files=[('fileName', csv_path)])
        self.assertEqual(resp.status_code, 201)
        self.assertIn(b'Successfully inserted', resp.body)

    def test_insert_experimentTreatments(self):
        csv_filename='experiments_treatments.csv'
        csv_path='/home/saurabh/Desktop/PEcAn/YABA/input_files/'+csv_filename
        resp = self.app.post('http://www.0.0.0.0:5000/yaba/v1/experiments_treatments',
            upload_files=[('fileName', csv_path)])
        self.assertEqual(resp.status_code, 201)
        self.assertIn(b'Successfully inserted', resp.body)

    def test_insert_sitesCultivars(self):
        csv_filename='sites_cultivars.csv'
        csv_path='/home/saurabh/Desktop/PEcAn/YABA/input_files/'+csv_filename
        resp = self.app.post('http://www.0.0.0.0:5000/yaba/v1/sites_cultivars',
            upload_files=[('fileName', csv_path)])
        self.assertEqual(resp.status_code, 201)
        self.assertIn(b'Successfully inserted', resp.body)

    def test_insert_citationsSites(self):
        csv_filename='citations_sites.csv'
        csv_path='/home/saurabh/Desktop/PEcAn/YABA/input_files/'+csv_filename
        resp = self.app.post('http://www.0.0.0.0:5000/yaba/v1/citations_sites',
            upload_files=[('fileName', csv_path)])
        self.assertEqual(resp.status_code, 201)
        self.assertIn(b'Successfully inserted', resp.body)
  
if __name__ == '__main__': 
    unittest.main() 
